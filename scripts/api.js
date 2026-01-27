export async function criar_Relato(id,usuario,titulo,conteudo,categoria,sensivel,dataR,BASE_URL){

try{
   const resposta = await fetch(`${BASE_URL}/api/relatos`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({
        id_relato:id,
        id_usuario:usuario,
        titulo: titulo,
        conteudo: conteudo,
        categoria: categoria,
        sensivel: sensivel,
        data_relato: dataR
    })
});

if(!resposta.ok){
    throw new Error
}
const dados = await resposta.json();
console.log(dados);
return dados;
}
catch(err){
    console.error("deu ruim",err);
}
}

/*criar_Relato(
    434343,
    1768785127558,
    "Meu relato do Front",
    "oi oi oi oi oi oi oi oi oi",
    "teste2",
    true,
    '2026-01-15'
); 
*/
export async function listar_Relatos(BASE_URL){
    try{
        const resposta = await fetch(`${BASE_URL}/api/relatos`);

        if(!resposta.ok){
            throw new Error;
        }
        const dados = await resposta.json();
        //console.log(dados);
        return dados;
    }catch(err){
        console.error("os erros te deixam mais forte..",err)
    }
}
//listar_Relatos("http://localhost:3000");


export async function apoia_relatos(BASE_URL,id){
    try{
        const resposta = await fetch(`${BASE_URL}/api/apoio/:relato=${id}`,{
            method: "PUT",
            headers: {"Content-Type":"aplication/json","X-usuario":`${localStorage.getItem("userID")}`},
            body: JSON.stringify({msg:"tentativa de apoio"})
        });

        if(!resposta.ok){
            throw new Error
        }
        const dados = await resposta.json();
        console.log(dados);
    }catch(err){
        console.error(err);
    }

} 

export async function analisar_dados(BASE_URL){
    try{
        const resposta = await fetch(`${BASE_URL}/api/analise`,({
            method: "GET",
            headers:{"Content-Type":"application/json","x-usuario":`${localStorage.getItem("userID")}`}
        }));

        if(!resposta.ok){
            throw new Error
        }

        const dados = await resposta.json();
        return dados
    }catch(err){
        console.error("falha ao analisar dados",err)
    }
}