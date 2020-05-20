<template>
    <div>
        <div class="container mb-4">
            <div class="row mt-2">
                <div class="col-md-12">
                    <button type="button" class="btn btn-primary btn-sm  " @click="redirectLista">
                        <img width="30px" src="./assets/icon/back-list.png"/> Listas
                    </button>
                </div>

            </div>
            <div class="row  p-4 mt-2 ">
                <div class=" col-md-12 m-auto  p-2 text-center">
                    <div class="text-center">
                        <h5>LISTA</h5>
                        <hr>
                        <b>ID</b> : {{lista.id}} <br>
                        <b>Nome</b> : {{lista.nome}} <br>
                        <b>Total</b> : <b class="text-success">{{total.toFixed(2)}}</b><br>
                    </div>
                </div>
            </div>

            <div class="container mt-2 mb-2">
                <div class="row mb-2">
                <div class="col-md-12  text-right">
                    <button type="button" class="btn btn-success btn-sm float-right" @click="openModal">
                        <img width="30px" src="./assets/icon/product.png"/> Novo Item
                    </button>
                </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <input class="form-control" v-model="search" v-on:keyup="doSearch" placeholder="Pesquisar...">
                    </div>
                </div>
            </div>


            <div class="modal" tabindex="-1" role="dialog" id="modal-item">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header bg-success text-white">
                            <h5 class="text-center" v-if="!acaoEditar">Novo item</h5>
                            <h5 class="text-center" v-if="acaoEditar">Editar item Código ({{this.item.id}})</h5>
                        </div>
                        <div class="modal-body">
                            <div class="form-group ">
                                <label>Nome</label>
                                <input v-model="item.nome" class="form-control">
                            </div>
                            <div class="form-group">
                                <label>Quantidade</label>
                                <input v-model="item.quantidade" step="0" class="form-control">
                            </div>
                            <div class="form-group ">
                                <label>Preço</label>
                                <input v-model="item.preco" step="2" class="form-control"/>
                            </div>
                        </div>
                        <div class="modal-footer bg-light p-0">
                            <button @click="saveItem" class="btn btn-primary btn-sm m-1" v-if="!acaoEditar">
                                <img width="30px" src="./assets/icon/save.png"/>
                            </button>
                            <button @click="salvarEdicao" class="btn btn-primary btn-sm m-1" v-if="acaoEditar">
                                <img width="30px" src="./assets/icon/save-edit.png"/>
                            </button>
                            <button @click="cancelarELimpar" class="btn btn-danger btn-sm m-1">
                                <img width="30px" src="./assets/icon/cancel.png"/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-12">
                <table class="table table-bordered" v-if="!isMobile">
                    <thead class="bg-primary text-white">
                    <tr>
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
                            <div class="row p-1 text-center">
                                <a @click="editarItem(item.id)" class="btn btn-sm btn-primary text-white m-1">
                                    <img width="15px" src="./assets/icon/edit.png"/>
                                </a>
                                <a @click="removeItem(item.id)" class="btn btn-sm btn-danger text-white m-1">
                                    <img width="15px" src="./assets/icon/remove.png"/>
                                </a>
                            </div>
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

            <div v-if="isMobile" class="col-md-12 mt-3">
                <div class="card mt-2" v-for="(item, index) in items" :key="item.id">
                    <div class="card-header bg-primary text-white">
                        {{++index}}
                        <img width="30px" src="./assets/icon/product.png" class="float-right"/>
                    </div>
                    <div class="card-body">
                        <ul class="list-group">
                            <li><b>Código:</b> {{item.id}}</li>
                            <li><b>Item:</b> {{item.nome}}</li>
                            <li><b>Quantidade:</b> {{item.quantidade}}</li>
                            <li><b>Preço Unitario:</b> {{item.preco}}</li>
                            <li><b>Preço Total:</b> {{item.total.toFixed(2)}}</li>
                        </ul>
                        <div class="text-right">
                            <a @click="editarItem(item.id)"
                               class="btn btn-sm btn-primary text-white ">
                                <img width="30x" src="./assets/icon/edit.png"/></a>
                            <a @click="removeItem(item.id)"
                               class="btn btn-sm btn-danger text-white ml-1">
                                <img width="30x" src="./assets/icon/remove.png"/>
                            </a>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import checkMobile from "./check-mobile.";
    import $ from "jquery";
    import toastr from 'toastr';
    import store from "./store";

    export default {
        name: "ListaDetalhe",
        data: () => ({
            isMobile: checkMobile(),
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
            total: 0,
            search: ''
        }),
        methods: {
            openModal: function () {
                $("#modal-item").show();
            },
            closeModal: function () {
                $("#modal-item").hide();
            },
            getLista: function (idLista) {
                let lista = store.lista.find(idLista);
                if (!lista) {
                    this.$router.push('/');
                } else {
                    this.lista = lista;
                    this.getItems(idLista);
                }
            },
            saveItem: function () {
                try {
                    this.item.listaId = this.lista.id;
                    store.items.create(this.item);
                    this.getItems(this.lista.id);
                    this.item = {
                        id: '',
                        nome: '',
                        quantidade: '',
                        preco: '',
                        total: ''
                    }
                    toastr.success("Item salvo com sucesso!");
                    this.closeModal();

                } catch (e) {
                    toastr.success(e.message);
                }

            },
            redirectLista: function () {
                this.$router.push(`/Lista`);
            },
            getItems: function (idLista) {
                this.items = store.items.getItemsLista(idLista);
                this.total = store.items.getValorTotal(idLista);
            },
            removeItem: function (id) {
                try {
                    if (!confirm("Deseja Excluir esse item?")) {
                        return;
                    }
                    store.items.remove(id);
                    toastr.success("Excluido com sucesso!");
                    this.getItems(this.lista.id)

                } catch (e) {
                    toastr.error(e.message)
                }

            },
            editarItem: function (id) {
                try {
                    const item = store.items.find(id);
                    this.item = Object.assign(item);
                    this.acaoEditar = true;
                    this.openModal();
                } catch (e) {
                    toastr.error(e.message);
                }
            },
            salvarEdicao: function () {

                try {
                    store.items.update(this.item);
                    this.item = {
                        id: '',
                        nome: '',
                        quantidade: '',
                        preco: '',
                        total: ''
                    };
                    this.acaoEditar = false;
                    toastr.success("Item salvo com sucesso!");
                    this.closeModal();
                    this.getItems(this.lista.id);

                } catch (e) {
                    toastr.error(e.message);
                }

            },
            cancelarELimpar: function () {
                this.item = {
                    id: '',
                    nome: '',
                    quantidade: '',
                    preco: '',
                    total: ''
                };
                this.closeModal();
                this.acaoEditar = false;
            },
            doSearch: function () {
                this.items = store.items.search(this.lista.id, this.search)
            }
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
        }
    }
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
