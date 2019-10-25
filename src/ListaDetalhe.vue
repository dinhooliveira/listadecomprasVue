<template>
    <div>
        <div class="container">
            <button type="button" class="btn btn-primary btn-sm m-2" @click="redirectLista">Voltar</button>
            <div class=" col-md-4 m-auto border p-2 text-center">
                <div class="text-center">
                    <h5>LISTA</h5>
                    <hr>
                    <b>ID</b> : {{lista.id}} <br>
                    <b>Nome</b> : {{lista.nome}} <br>
                    <b>Status</b> : {{lista.status}} <br>
                </div>
            </div>

            <div class="row border p-4 m-3">
                <div class="col-md-12">
                    <h5 class="text-center" v-if="!acaoEditar">Novo item</h5>
                    <h5 class="text-center" v-if="acaoEditar">Editar item Código ({{this.item.id}})</h5>
                    <hr/>
                </div>
                <div class="form-group col-md-8">
                    <label>Nome</label>
                    <input v-model="item.nome" class="form-control">
                </div>
                <div class="form-group col-md-2">
                    <label>Quantidade</label>
                    <input v-model="item.quantidade" step="0" class="form-control">
                </div>
                <div class="form-group col-md-2">
                    <label>Preço</label>
                    <input v-model="item.preco" step="2" class="form-control"/>
                </div>
                <div class="col-md-12 text-right">
                    <button @click="saveItem" class="btn btn-primary btn-sm m-1" v-if="!acaoEditar">Salvar</button>
                    <button @click="salvarEdicao" class="btn btn-primary btn-sm m-1" v-if="acaoEditar">Salvar Edição
                    </button>
                    <button @click="cancelarELimpar" class="btn btn-danger btn-sm m-1">Cancelar</button>
                </div>

            </div>
            <div class="col-md-12" style="overflow: auto">
                <table class="table table-bordered">
                    <thead>
                    <tr class="bg-light">
                        <th colspan="7" class="text-center">ITEMS</th>
                    </tr>
                    <tr>
                        <th>#</th>
                        <th>Codigo</th>
                        <th>Nome</th>
                        <th>Preço</th>
                        <th>Quantidade</th>
                        <th>Total</th>
                        <th>Ação</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index) in items" :key="item.id">
                        <td>{{++index}}</td>
                        <td>{{item.id}}</td>
                        <td>{{item.nome}}</td>
                        <td>{{item.preco}}</td>
                        <td>{{item.quantidade}}</td>
                        <td>{{item.total.toFixed(2)}}</td>
                        <td>
                            <ul>
                                <li><a @click="editarItem(item.id)"
                                       class="btn btn-sm btn-primary text-white m-1">Editar</a>
                                </li>
                                <li><a @click="removeItem(item.id)" class="btn btn-sm btn-danger text-white">Remover</a>
                                </li>
                            </ul>
                        </td>
                    </tr>
                    <tr>
                        <th colspan="5"></th>
                        <th>{{total.toFixed(2)}}</th>
                        <th></th>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ListaDetalhe",
        data: () => ({
            lista: {},
            items: [],
            item: {
                id: '',
                nome: '',
                quantidade: '',
                preco: '',
                total: ''
            },
            acaoEditar: false,
            total: 0
        }),
        methods: {
            getLista: function (id) {
                let listas = JSON.parse(localStorage.getItem('listas')) || [];
                const lista = listas.find(function (obj) {
                    return obj.id == id;
                });

                if (!lista) {
                    this.$router.push('/');
                } else {
                    this.lista = lista;
                    this.getItems();
                }
            },
            saveItem: function () {
                if (this.item.nome == '' || this.item.quantidade == '' || this.item.quantidade < 1 || this.item.preco == '' || this.item.preco < 1) {
                    alert('campos Nome,Quantidade e Preço são obrigatorios');
                    return;
                }
                this.item.total = this.item.preco * this.item.quantidade;
                this.item.listaId = this.lista.id;
                let idListaItem = localStorage.getItem('idListaItem') > 0 ? localStorage.getItem('idListaItem') : 0;
                idListaItem++;
                localStorage.setItem('idListaItem', idListaItem)
                this.item.id = idListaItem;
                let items = JSON.parse(localStorage.getItem('items')) || [];
                items.push(this.item);
                localStorage.setItem('items', JSON.stringify(items));
                this.getItems(this.lista.id);
                this.item = {
                    id: '',
                    nome: '',
                    quantidade: '',
                    preco: '',
                    total: ''
                }
            },
            redirectLista: function () {
                this.$router.push(`/Lista`);
            },
            getItems: function (id) {
                let items = JSON.parse(localStorage.getItem('items')) || [];
                this.items = items.filter(function (obj) {
                    return obj.listaId == id;
                });
                let i;
                this.total = 0;
                for (i = 0; i < this.items.length; i++) {
                    this.total += parseFloat(this.items[i].total)
                }
            },
            removeItem: function (id) {
                this.items = this.items.filter(function (obj) {
                    return obj.id != id;
                });
                localStorage.setItem('items', JSON.stringify(this.items));
                this.getItems(this.lista.id)
            },
            editarItem: function (id) {

                const item = this.items.find(function (obj) {
                    return obj.id == id;
                });

                if (item.id == '') {
                    alert("Não foi encontrado!");
                    return;
                } else {
                    this.item = Object.assign(item);
                    this.acaoEditar = true;
                }

            },
            salvarEdicao: function () {
                if (this.item.nome == '' || this.item.quantidade == '' || this.item.quantidade < 1 || this.item.preco == '' || this.item.preco < 1) {
                    alert('campos Nome,Quantidade e Preço são obrigatorios');
                    return;
                }
                this.items;
                let find = false;
                let i = 0;
                for (i; i < this.items.length; i++) {
                    if (this.items[i].id == this.item.id) {
                        find = true;
                        break;
                    }
                }
                if (find == false) {
                    alert("Não foi possivel encontrar item da lista");
                    return;
                }
                this.items[i].nome = this.item.nome;
                this.items[i].quantidade = this.item.quantidade;
                this.items[i].preco = this.item.preco;
                this.items[i].total = this.item.preco * this.item.quantidade;
                localStorage.setItem('items', JSON.stringify(this.items));
                this.item = {
                    id: '',
                    nome: '',
                    quantidade: '',
                    preco: '',
                    total: ''
                };
                this.acaoEditar = false;
                this.getItems(this.lista.id);


            },
            cancelarELimpar: function () {
                this.item = {
                    id: '',
                    nome: '',
                    quantidade: '',
                    preco: '',
                    total: ''
                },
                    this.acaoEditar = false;
            },
        },
        watch: {
            'item.quantidade'(value) {
                this.item.quantidade = value.replace(/[^\d]+/g, '');
            },
            'item.preco'(value) {
                let v = value.replace(/\D/g, '');
                v = (v / 100).toFixed(2) + '';

                v = v.replace(/(\d)(\d{3}),/g, "$2.");
                this.item.preco = v;
            }

        },
        beforeMount() {
            this.getLista(this.$route.params.id);
            this.getItems(this.$route.params.id);
        }
    }
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
