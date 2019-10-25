<template>
    <div class="container mt-4">
        <div class="jumbotron">
            <h1 class="display-4 text-center">Bem vindo ao minha Lista!</h1>
            <p class="lead">Todas as informações são salvas em seu localstorage não utilizamos banco de dados particular.</p>
            <hr class="my-4">
            <p>Clique em começar para adicionar suas listas de compras</p>
            <a class="btn btn-primary btn-lg text-white " role="button" @click="redirectLista">Começar</a>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'Home',
        methods:{
            redirectLista:function(){
                this.$router.push("/lista");
            }
        }
    };
</script>
<style scoped>
</style>
