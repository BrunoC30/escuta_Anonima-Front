//conexão
import { listar_Relatos,criar_Relato,apoia_relatos,analisar_dados} from "./api.js";
const BASE_URL = import.meta.env.VITE_API_URL;
//elementos
const navMenu = document.querySelectorAll("nav p");
const sessoes = document.querySelectorAll("section");
const sessaoRelatorios = document.querySelector("#relatos .container");

const titulo = document.querySelector("#tituloModal");
const textUser = document.querySelector("#conteudoUsuario");
const aviso = document.querySelector("#aviso");
const  categorias = document.querySelector("#categorias-relato");
const checkBox = document.querySelector(".politica");
// - - - BOTÕES - - -
const btaoCriarRelato = document.querySelector("#create-relatorio");
const btaoEnviarRelato = document.querySelector("#enviar");
const btaoExit = document.querySelector("#exit");
// - - - !!! AÇÕES !!! - - -

//faz cada página ser carregada de acordo com nav
navMenu.forEach(item=>{
    item.addEventListener("click",()=>{
        mostrarSessao(item.dataset.go);
        //previnir que o modal fique ativo
        const pop = document.querySelector(".pop-up");
        pop.classList.add("hide");
    })
})

//acionar o pop-up
btaoCriarRelato.addEventListener("click",()=>{
    abrirRelatorio();
});
//sair do modal
btaoExit.addEventListener("click",()=>{
    abrirRelatorio();
})
//numero de caracteres atualiza
textUser.addEventListener("input",()=>{
    const limite = document.querySelector("#limite");
    limite.textContent = `${textUser.value.length}/1200`;
})
checkBox.addEventListener("click",()=>{
  checarPoliticas();
})
//enviar relato
btaoEnviarRelato.addEventListener("click",()=>{
    checarPoliticas();

   if(textUser.value.length>=225){
    let idRelato = Date.now();
    let idUser = criarIDanonimo();
    let dataAtual = gerarDataAtual();
    criar_Relato(
        idRelato,
        idUser,
        titulo.value,
        textUser.value,
        categorias.value,
        false,
        dataAtual,
        BASE_URL
    );
    abrirRelatorio();
}else{
    avisar();
}
});

// - - - !!! FUNÇÕES !!! - - -

function mostrarSessao(id){
  sessoes.forEach(elemento=>{
      elemento.classList.add("hide")
      if(elemento.id ===id){
          elemento.classList.remove("hide");
        }
    });
    
}
//abre o modal
function abrirRelatorio(){
 const pop = document.querySelector(".pop-up")
 pop.classList.toggle("hide");
}

async function montarRelatorios(){
   const dados = await listar_Relatos(BASE_URL);
   dados.forEach(objeto=>{
    //criação dos componentes
    const relatoContainer = document.createElement("div");
    relatoContainer.classList.add("relato");
    relatoContainer.classList.add("rer");
    relatoContainer.dataset.id=objeto.id_relato;
    // - - - - elementos HEADER - - - -
    const Header = document.createElement("header");
    const perfil = document.createElement("div");
    perfil.classList.add("relato-perfil");

    const icon = document.createElement("div");
    icon.classList.add("relato-icon");
    const nickname = document.createElement("p");
    nickname.textContent="Anonimo";

    const datahora = document.createElement("time");
    datahora.classList.add("relato-data");
    datahora.textContent = converterIso(objeto.data_relato);
    // !!MONTAGEM HEADER
    Header.appendChild(perfil);
    perfil.appendChild(icon);
    perfil.appendChild(nickname);
    Header.appendChild(datahora);


    // - - - - elementos MAIN - - - -
    const relatoMain = document.createElement("main");
    const containerTitulo = document.createElement("div");
    containerTitulo.classList.add("tituloContainer");

    const categoria = document.createElement("span");
    categoria.classList.add("categoriaElement");
    categoria.textContent = objeto.categoria;

    const titulo = document.createElement("h2");
    titulo.classList.add("relatoTitulo");
    titulo.textContent = objeto.titulo;

    const conteudo = document.createElement("p");
    conteudo.classList.add("relato-conteudo");
    conteudo.textContent = objeto.conteudo;
    // !!MONTAGEM MAIN
    containerTitulo.appendChild(titulo);
    containerTitulo.appendChild(categoria);
    relatoMain.appendChild(containerTitulo);
    relatoMain.appendChild(conteudo);

    // - - - - elementos FOOTER - - - -
    const footer = document.createElement("footer");
    const apoiar = document.createElement("button");
    apoiar.classList.add("relato-apoio");

    apoiar.addEventListener("click",()=>{
        let idRelatoFront = relatoContainer.dataset.id;
        apoia_relatos(BASE_URL,idRelatoFront);
        setTimeout(()=>{
            let todosOsRelatos = document.querySelectorAll(".rer");
            todosOsRelatos.forEach(relato=>{relato.remove()});
            montarRelatorios();
        },500)
        
    });
    
    const numeroApoios = document.createElement("p");
    numeroApoios.textContent = objeto.total_apoios;
    numeroApoios.classList.add("relato-total-apoio");
    //!!MONTAGEM FOOTER
    footer.appendChild(apoiar);
    footer.appendChild(numeroApoios);

    //MONTAGEM FINAL
    relatoContainer.appendChild(Header);
    relatoContainer.appendChild(relatoMain);
    relatoContainer.appendChild(footer);

    sessaoRelatorios.appendChild(relatoContainer);
   })
}
montarRelatorios();

function criarIDanonimo(){
    let userID = "";
    if(!localStorage.getItem("userID")){
        //cria e salva pela primeira vez
        userID = Date.now();
        localStorage.setItem("userID",userID);
    }else{
        userID = localStorage.getItem("userID");
    }
    return Number(userID);
}

criarIDanonimo();

function avisar(){
    let segundos = 0;
    aviso.classList.remove("hide");
const intervalo = setInterval(()=>{
    if(segundos===3){
        aviso.classList.add("hide");
        clearInterval(intervalo);
    }
    segundos++;
},1000)
}

function gerarDataAtual(){

    const data = new Date();
    let ano = data.getFullYear();

    let mes = ()=>{
        let verificar = data.getMonth()+1
        if(verificar<=9){
            verificar = `0${verificar}`
        }
        return verificar;
    }

    let dia = data.getDate();

    let formatoBanco = `${ano}-${mes()}-${dia}`;
    console.log(formatoBanco);
  
    return formatoBanco;
}

gerarDataAtual();

function converterIso(iso){

const data = new Date(iso);
const formatoBr = data.toLocaleDateString('pt-BR');
return formatoBr;
}

function checarPoliticas(){
      if(checkBox.checked){
        btaoEnviarRelato.disabled = false;
        btaoEnviarRelato.classList.remove("block")
        btaoEnviarRelato.classList.add("smoth");
    }else{
        btaoEnviarRelato.disabled = true;
        btaoEnviarRelato.classList.add("block")
        btaoEnviarRelato.classList.remove("smoth");
    }
}
checarPoliticas();




async function formatarAnalise(){
    //base de dados
    const dados = await analisar_dados(BASE_URL);
    console.log(dados);
    //elementos para serem formatados
    const graficoRelatos = document.querySelector("#totalRelatos span");
    const graficoApoios = document.querySelector("#apoios-usuario span");
    const graficoCategorias = document.querySelector("#porcentagem-container");


    
   graficoRelatos.textContent = dados.relatos[0].total_relatos
   graficoApoios.textContent = dados.apoios[0].total_apoios;
    

   dados.categorias.forEach(objeto=>{
    //criação de elemento visual
    const elementePorcentagem = document.createElement("div");
    elementePorcentagem.classList.add("dado-categoria");
    elementePorcentagem.textContent = `${objeto.porcentagem}% ${objeto.categoria}`;

    graficoCategorias.appendChild(elementePorcentagem);
   })
    
}

formatarAnalise();