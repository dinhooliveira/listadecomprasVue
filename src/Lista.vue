<template>
    <div class="container mt-4 mb-4">

        <div class="col-md-12 text-right">

            <a @click="openModal" class="btn btn-success" :class="listas.length < 1 ? 'pulse' : ''">
                <span class="text-white" v-if="listas.length < 1"> Incluir uma nova lista  </span>
                <img width="30px" src="./assets/icon/new-list.png"/>
            </a>
        </div>

        <div class="col-md-6 m-2">
            <input class="form-control" v-model="search" v-on:keyup="doSearch" placeholder="Pesquisar...">
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
                        <button type="button" @click="salvarEdicao" class="btn btn-primary btn-sm m-2"
                                v-if="acaoEditar">
                            <img width="30px" src="./assets/icon/save-edit.png"/>
                        </button>
                        <button type="button" @click="cancelarELimpar" class="btn btn-danger btn-sm m-2">
                            <img width="30px" src="./assets/icon/cancel.png"/>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-md-12">
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
                        <div class="row p-1">
                            <a @click="editarLista(lista.id)"
                               class="btn btn-sm btn-primary text-white m-1">
                                <img width="15px" src="./assets/icon/edit.png"/>
                            </a>
                            <a @click="removeLista(lista.id)"
                               class="btn btn-sm btn-danger text-white m-1">
                                <img width="15px" src="./assets/icon/remove.png"/>
                            </a>
                            <div>
                                <a @click="redirectItems(lista.id)" class="btn btn-sm btn-info text-white m-1"
                                   :class="totalLista(lista.id) < 1 ? 'pulse' : ''">
                                    <img width="15px" src="./assets/icon/cart.png"/>
                                    <span v-if="totalLista(lista.id) < 1"> Incluir items</span>
                                    <span v-if="totalLista(lista.id) > 0">{{totalLista(lista.id)}}</span>
                                </a>
                            </div>
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
                        <a @click="redirectItems(lista.id)" class="btn btn-sm btn-info text-white ml-1"
                           :class="totalLista(lista.id) < 1 ? 'pulse' : ''">
                            <img width="30x" src="./assets/icon/cart.png"/>
                            <span v-if="totalLista(lista.id) < 1">Incluir items</span>
                            <span v-if="totalLista(lista.id) > 0">{{totalLista(lista.id)}}</span>
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
    import store from './store';

    export default {
        name: 'Lista',
        data: () => ({
            isMobile: checkMobile(),
            listas: [],
            lista: {
                id: '',
                nome: ''
            },
            search:'',
            acaoEditar: false
        }),
        mounted() {
            console.log(this.isMobile);
        },
        methods: {
            openModal: function () {
                $("#modal-lista").show();
            },
            closeModal: function () {
                $("#modal-lista").hide();
            },
            saveLista: function () {
                try {
                    store.lista.create(this.lista.nome);
                    this.lista = {
                        id: '',
                        nome: '',
                    };
                    toastr.success("Lista salva com sucesso!");
                    this.closeModal();
                    this.getListas();
                } catch (e) {
                    toastr.error(e.message);
                }

            },
            getListas: function () {
                this.listas = store.lista.getAll();
            },
            removeLista: function (id) {
                try {
                    if (!confirm("Deseja Excluir essa lista?")) {
                        return;
                    }
                    store.lista.remove(id);
                    this.listas = store.lista.getAll();
                    toastr.success("Excluido com sucesso!");

                } catch (e) {
                    toastr.error(e.message);
                }


            },
            editarLista: function (id) {
                try {
                    const lista = store.lista.find(id);
                    this.lista = Object.assign(lista);
                    this.acaoEditar = true;
                    this.openModal();
                } catch (e) {
                    toastr.error(e.message);
                }
            },
            salvarEdicao: function () {
                try {
                    store.lista.update(this.lista)

                    this.lista = {
                        id: '',
                        nome: ''
                    };
                    this.acaoEditar = false;
                    toastr.success("Lista salva com sucesso!");
                    this.closeModal();
                    this.getListas();

                } catch (e) {
                    toastr.error(e.message);
                }
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
            },
            totalLista: function (id) {
                return store.items.contarItemsDaLista(id);
            },
            doSearch:function(){
                this.listas = store.lista.search(this.search)
            }
        },
        beforeMount() {
            this.getListas();
        },
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

    .ajuda {
        width: 200px;
        padding: 5px;
        background: green;
        color: #fff;
        text-align: left;
        border-radius: 15px;
        position: absolute;
        right: 90px;
    }

    .ajuda-items {
        width: 120px;
        padding: 5px;
        background: green;
        color: #fff;
        text-align: left;
        border-radius: 15px;
        position: absolute;
        right: -33px;
    }


    .pulse {
        animation: pulse 0.7s infinite;
        margin: 0 auto;
        animation-direction: alternate;
        -webkit-animation-name: pulse;
        animation-name: pulse;
    }

    @-webkit-keyframes pulse {
        0% {
            -webkit-transform: scale(1);
            -webkit-filter: brightness(100%);
        }
        100% {
            -webkit-transform: scale(1.1);
            -webkit-filter: brightness(150%);
        }
    }

    @keyframes pulse {
        0% {
            transform: scale(1);
            filter: brightness(100%);
        }
        100% {
            transform: scale(1.1);
            filter: brightness(150%);
        }
    }
</style>
