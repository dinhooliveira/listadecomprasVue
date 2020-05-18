<template>
    <div class="container mt-4 mb-4">

        <div class="col-md-12 text-right">
            <a @click="openModal" class="btn btn-success">
                <img width="30x" src="./assets/icon/new-list.png"/>
            </a>
        </div>

        <div class="modal" tabindex="-1" role="dialog" id="modal-lista">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-success text-white">
                        <h5 class="text-center" v-if="!this.acaoEditar">Nova Lista</h5>
                        <h5 class="text-center" v-if="this.acaoEditar && this.lista.id !==''">Editar Lista Código
                            ({{this.lista.id}})
                        </h5>
                    </div>
                    <div class="modal-body">
                        <label>Nome da Lista</label>
                        <input v-model="lista.nome" class="form-control">
                    </div>
                    <div class="modal-footer bg-light p-0">
                        <button type="button" @click="saveLista" class="btn btn-primary btn-sm m-2" v-if="!acaoEditar">
                            <img width="30px" src="./assets/icon/save.png"/>
                        </button>
                        <button type="button" @click="salvarEdicao" class="btn btn-primary btn-sm m-2" v-if="acaoEditar">
                            <img width="30px" src="./assets/icon/save-edit.png"/>
                        </button>
                        <button type="button" @click="cancelarELimpar" class="btn btn-danger btn-sm m-2">
                            <img width="30px" src="./assets/icon/cancel.png"/>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-md-12" style="overflow: auto">
            <table class="table mt-4 table-bordered" v-if="!isMobile">
                <thead class="text-left bg-primary text-white">
                <tr>
                    <th colspan="5" class="text-center">LISTAS</th>
                </tr>
                <tr>
                    <th>#</th>
                    <th>Código</th>
                    <th>Nome</th>
                    <th>Ação</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(lista,index) in listas" v-bind:key="lista.id">
                    <td style="width:5px">{{++index}}</td>
                    <td style="width:5px">{{lista.id}}</td>
                    <td style="width:200px">{{lista.nome}}</td>
                    <td style="width:50px">
                         <div class="row p-1 ">
                            <a @click="editarLista(lista.id)"
                               class="btn btn-sm btn-primary text-white m-1">
                                <img width="15px"  src="./assets/icon/edit.png" />
                            </a>
                            <a @click="removeLista(lista.id)"
                               class="btn btn-sm btn-danger text-white m-1">
                                <img width="15px"  src="./assets/icon/remove.png" />
                            </a>
                            <a @click="redirectItems(lista.id)" class="btn btn-sm btn-info text-white m-1">
                                <img width="15px"  src="./assets/icon/cart.png" />
                            </a>
                         </div>

                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div v-if="isMobile" class="col-md-12 mt-3">
            <div class="card mt-2" v-for="(lista,index) in listas" v-bind:key="lista.id">
                <div class="card-header bg-primary text-white">
                    {{++index}}
                </div>
                <div class="card-body">
                    <ul class="list-group">
                        <li><b>Código:</b>{{lista.id}}</li>
                        <li><b>Lista:</b>{{lista.nome}}</li>
                    </ul>
                    <div class="text-right">
                        <a @click="editarLista(lista.id)"
                           class="btn btn-sm btn-primary text-white ">
                            <img width="30x" src="./assets/icon/edit.png"/></a>
                        <a @click="removeLista(lista.id)"
                           class="btn btn-sm btn-danger text-white ml-1">
                            <img width="30x" src="./assets/icon/remove.png"/>
                        </a>
                        <a @click="redirectItems(lista.id)" class="btn btn-sm btn-info text-white ml-1">
                            <img width="30x" src="./assets/icon/cart.png"/>
                        </a>
                    </div>

                </div>

            </div>
        </div>
    </div>

</template>

<script>

    import checkMobile from "./check-mobile.";
    import $ from 'jquery';
    import toastr from 'toastr';

    export default {
        name: 'Lista',
        data: () => ({
            isMobile: checkMobile(),
            listas: [],
            lista: {
                id: '',
                nome: ''
            },
            acaoEditar: false
        }),
        mounted() {
            console.log(this.isMobile);
        },
        methods: {
            openModal:function(){
               $("#modal-lista").show();
            },
            closeModal:function(){
                $("#modal-lista").hide();
            },
            saveLista: function () {
                if (this.lista.nome == '') {
                    toastr.error('O nome da lista  é obrigatorio');
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
                };
                toastr.success("Lista salva com sucesso!");
                this.closeModal();
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
                let items = JSON.parse(localStorage.getItem('items')) || [];
                let newItems = items.filter(function (obj) {
                    console.log(obj.listaId != id);
                    return obj.listaId != id;
                });
                localStorage.setItem('items', JSON.stringify(newItems));
                toastr.success("Excluido com sucesso!");

            },
            editarLista: function (id) {

                const lista = this.listas.find(function (obj) {
                    return obj.id == id;
                });

                if (lista.id == '') {
                    toastr.error("Não foi encontrado!");
                    return;
                } else {
                    this.lista = Object.assign(lista);
                    this.acaoEditar = true;
                    this.openModal();
                }

            },
            salvarEdicao: function () {
                if (this.lista.nome == '' || this.lista.status == '') {
                    toastr.error('O nome da lista e o status é obrigatorio');
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
                    toastr.error("Não foi possivel encontrar item da lista");
                    return;
                }
                this.listas[i].nome = this.lista.nome;
                this.listas[i].status = this.lista.status;
                localStorage.setItem('listas', JSON.stringify(this.listas));
                this.lista = {
                    id: '',
                    nome: ''
                };
                this.acaoEditar = false;
                toastr.success("Lista salva com sucesso!");
                this.closeModal();
                this.getListas();


            },
            cancelarELimpar: function () {
                this.lista = {
                    id: '',
                    nome: ''
                };
                this.acaoEditar = false;
                this.closeModal();
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
    @import "../node_modules/toastr/toastr.scss";
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
