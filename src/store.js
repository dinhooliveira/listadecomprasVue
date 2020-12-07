
const store = {
    lista: {
        getAll: function () {
            return JSON.parse(localStorage.getItem('listas')) || [];
        },
        create: function (nome) {
            if (nome === '' || nome == null) {
                throw new Error('O nome da lista  é obrigatorio');
            }
            let listas = this.getAll();
            listas.push({id: this.generateNewSequenceId(), nome: nome});
            localStorage.setItem('listas', JSON.stringify(listas));
            return true;
        },
        update: function ({id, nome}) {
            if (nome === '' || nome == null) {
                throw new Error('O nome da lista é obrigatorio');
            }
            let listas = this.getAll()
            const found = listas.findIndex(function (value) {
                return value.id === id;
            });

            if (found === -1 || found == null) {
                throw new Error('Lista não encontrada!');
            }
            listas[found].nome = nome;

            localStorage.setItem('listas', JSON.stringify(listas));
            return true;

        },
        remove: function (id) {
            let listas = this.getAll();
            let listaSemitemtem = listas.filter(function (obj) {
                return obj.id !== id;
            });
            if (listas.length === listaSemitemtem.length) {
                throw new Error("Erro ao excluir lista");
            }
            store.items.removerTodosItemsDaLista(id);
            localStorage.setItem('listas', JSON.stringify(listaSemitemtem));
            return true;
        },
        find: function (id) {
            const lista = this.getAll().find(function (obj) {
                return parseInt(obj.id) === parseInt(id);
            });
            if (!lista) {
                throw new Error("Lista não encontrada!");
            }
            return lista;
        },
        getSequenceId: function () {
            return parseInt(localStorage.getItem('idLista') > 0 ? localStorage.getItem('idLista') : 0);
        },
        generateNewSequenceId: function () {
            const newId  = this.getSequenceId() + 1;
            localStorage.setItem('idLista', newId);
            return newId;
        },
        search:function(value){
           return this.getAll().filter(function(obj){
                 return obj.nome.indexOf(value) !== -1;
            });
        },
        whatsappWebShared(id){
            const message =  store.lista.messageWhatsapp(id);
            window.open(`https://web.whatsapp.com/send?text=${encodeURIComponent(message)}`,'_blank');
        },
        whatsappMobileShared(id){
           const message =  store.lista.messageWhatsapp(id);
            window.open(`https://whatsapp.com/send?text=${encodeURIComponent(message)}`,'_blank');
        },
        messageWhatsapp(id){
            const item = store.lista.find(id);
            const items =  store.items.getItemsLista(id);
            var message = `[ ${item.nome} ] \n`;
            var numeberItem = 1;
            items.forEach(item=>{
                message+=`Item ${numeberItem}\n`
                message+= `Produto :${item.nome} | Preço: ${item.preco} | Quantidade: ${item.quantidade} | Subtotal: ${item.total.toFixed(2)}\n`;
                message+="\n"
                numeberItem++;
            });
            message+=`TOTAL ${store.items.getValorTotal(id).toFixed(2)}`;
            return message;
        }
    },
    items: {
        getAll: function () {
            return JSON.parse(localStorage.getItem('items')) || [];
        },
        create: function ({listaId, nome, quantidade, preco}) {
            if (
                nome === ''
                || quantidade === ''
                || quantidade < 0
                || preco == ''
                || preco < 0) {
                throw  new Error('campos Nome,Quantidade e Preço são obrigatorios');
            }
            if (isNaN(listaId)) {
                throw new Error("ID da Lista não encontrado!");
            }
            const total = parseFloat(preco) * parseInt(quantidade);
            let items = this.getAll();
            items.push({
                id: this.generateNewSequenceId(),
                nome: nome,
                quantidade: quantidade,
                preco: preco,
                total: total,
                listaId: listaId
            });
            localStorage.setItem('items', JSON.stringify(items));

        },
        update: function({id,nome,quantidade,preco}){
            if (nome === '' || quantidade === '' || quantidade < 1 || preco == '' || preco < 1) {
                throw new Error('campos Nome,Quantidade e Preço são obrigatorios');
            }
            if(id==='' || id==null){
                throw new Error('ID do item não encontrado!');
            }
            let items = this.getAll()
            const found = items.findIndex(function (value) {
                return value.id === id;
            });

            if (found === -1 || found == null) {
                throw new Error('Item não encontrada!');
            }
            items[found].nome = nome;
            items[found].quantidade = quantidade;
            items[found].preco = preco;
            items[found].total = preco * quantidade;
            localStorage.setItem('items', JSON.stringify(items));
        },
        remove: function (id) {
            let items = this.getAll();
            let itemsSemItem = items.filter(function (obj) {
                return parseInt(obj.id) !== parseInt(id);
            });
            if (items.length === itemsSemItem.length) {
                throw new Error("Erro ao excluir lista");
            }
            store.items.removerTodosItemsDaLista(id);
            localStorage.setItem('items', JSON.stringify(itemsSemItem));
            return true;
        },
        find: function (id) {
            const item = this.getAll().find(function (obj) {
                return parseInt(obj.id) === parseInt(id);
            });
            if (!item) {
                throw new Error("Lista não encontrada!");
            }
            return item;
        },
        getItemsLista(idLista) {
            return this.getAll().filter(function (obj) {
                return parseInt(obj.listaId) === parseInt(idLista);
            });
        },
        removerTodosItemsDaLista: function (idLista) {
            let items = this.getAll();
            let newItems = items.filter(function (obj) {
                return obj.listaId != idLista;
            });
            localStorage.setItem('items', JSON.stringify(newItems));
        },
        contarItemsDaLista: function (idLista) {
            let items = this.getAll();
            let itemsEncontrados = items.filter(function (obj) {
                return obj.listaId === idLista;
            });
            return itemsEncontrados.length;

        },
        getValorTotal: function (idLista) {
            var total = 0;
            this.getItemsLista(idLista).forEach(function (value) {
                total += parseFloat(value.total);
            })
            return total;
        },
        getSequenceId: function () {
            return parseInt(localStorage.getItem('idListaItem') > 0 ? localStorage.getItem('idListaItem') : 0);
        },
        generateNewSequenceId: function () {
            const newId  = this.getSequenceId() + 1;
            localStorage.setItem('idListaItem', newId);
            return newId;
        },
        search:function(listaId,value){
            return this.getAll().filter(function(obj){
                return obj.nome.indexOf(value) !== -1 && parseInt(obj.listaId) === parseInt(listaId);
            });
        }

    }

}

export default store;