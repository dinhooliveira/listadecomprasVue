<template>
    <div class="container mt-4">
        <div class="col-md-6 m-auto border p-4">
            <h5 class="text-center" v-if="!this.acaoEditar">Nova Lista</h5>
            <h5 class="text-center" v-if="this.acaoEditar && this.lista.id !==''">Editar Lista Código
                ({{this.lista.id}})</h5>
            <hr>
            <div class="form-group">
                <label>Nome da Lista</label>
                <input v-model="lista.nome" class="form-control">
            </div>
            <div class="form-group">
                <label>Status</label>
                <select v-model="lista.status" class="form-control">
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                </select>
            </div>
            <div class="text-right mt-4">
                <button type="button" @click="saveLista" class="btn btn-primary btn-sm m-2" v-if="!acaoEditar">Salvar
                </button>
                <button type="button" @click="salvarEdicao" class="btn btn-primary btn-sm m-2" v-if="acaoEditar">Alterar
                </button>
                <button type="button" @click="cancelarELimpar" class="btn btn-danger btn-sm m-2">Cancelar</button>
            </div>
        </div>
        <div class="col-md-12" style="overflow: auto">
            <table class="table mt-4 table-bordered">
                <thead class="text-left">
                <tr>
                    <th colspan="5" class="text-center bg-light">LISTAS</th>
                </tr>
                <tr>
                    <th>#</th>
                    <th>Código</th>
                    <th>Nome</th>
                    <th>Status</th>
                    <th>Ação</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(lista,index) in listas" v-bind:key="lista.id">
                    <td style="width:5px">{{++index}}</td>
                    <td style="width:5px">{{lista.id}}</td>
                    <td style="width:200px">{{lista.nome}}</td>
                    <td style="width:10px">{{lista.status}}</td>
                    <td style="width:50px">
                        <ul>
                            <li><a @click="editarLista(lista.id)"
                                   class="btn btn-sm btn-primary text-white m-1">Editar</a>
                            </li>
                            <li><a @click="removeLista(lista.id)"
                                   class="btn btn-sm btn-danger text-white m-1">Remover</a>
                            </li>
                            <li><a @click="redirectItems(lista.id)" class="btn btn-sm btn-info text-white m-1">
                                Items</a>
                            </li>

                        </ul>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'Lista',
        data: () => ({
            listas: [],
            lista: {
                id: '',
                nome: '',
                status: ''
            },
            acaoEditar: false
        }),
        methods: {
            saveLista: function () {
                if (this.lista.nome == '' || this.lista.status == '') {
                    alert('O nome da lista e o status é obrigatorio');
                    return
                }
                let listas = this.listas;
                let idLista = localStorage.getItem('idLista') > 0 ? localStorage.getItem('idLista') : 0;
                idLista++;
                this.lista.id = idLista;
                localStorage.setItem('idLista', idLista);
                listas.push(this.lista);
                localStorage.setItem('listas', JSON.stringify(listas));
                this.lista = {
                    id: '',
                    nome: '',
                    status: ''
                };

                this.getListas();
            },
            getListas: function () {
                this.listas = JSON.parse(localStorage.getItem('listas')) || [];
            },
            removeLista: function (id) {
                this.listas = this.listas.filter(function (obj) {
                    return obj.id != id;
                });
                localStorage.setItem('listas', JSON.stringify(this.listas));
            },
            editarLista: function (id) {

                const lista = this.listas.find(function (obj) {
                    return obj.id == id;
                });

                if (lista.id == '') {
                    alert("Não foi encontrado!");
                    return;
                } else {
                    this.lista = Object.assign(lista);
                    this.acaoEditar = true;
                }

            },
            salvarEdicao: function () {
                if (this.lista.nome == '' || this.lista.status == '') {
                    alert('O nome da lista e o status é obrigatorio');
                    return
                }
                this.listas;
                let find = false;
                let i = 0;
                for (i; i < this.listas.length; i++) {
                    if (this.listas[i].id == this.lista.id) {
                        find = true;
                        break;
                    }
                }
                if (find == false) {
                    alert("Não foi possivel encontrar item da lista");
                    return;
                }
                this.listas[i].nome = this.lista.nome;
                this.listas[i].status = this.lista.status;
                localStorage.setItem('listas', JSON.stringify(this.listas));
                this.lista = {
                    id: '',
                    nome: '',
                    status: ''
                };
                this.acaoEditar = false;
                this.getListas();


            },
            cancelarELimpar: function () {
                this.lista = {
                    id: '',
                    nome: '',
                    status: ''
                };
                this.acaoEditar = false;
            },
            redirectItems: function (idLista) {
                this.$router.push(`detalhe/${idLista}`);
            }
        },
        beforeMount() {
            this.getListas();
        }
    };
</script>
<style scoped>
    ul {
        list-style: none;

    }

    ul li {
        display: inline;
    }

    li {
        margin: 2px;
    }
</style>
