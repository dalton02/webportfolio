<script lang="ts">

  import mouseState from "$lib/localData/mouse.svelte";
  import { onMount } from "svelte";
  import WrapperPop from "./WrapperPop.svelte";
  import Input from "$components/assets/text/Input.svelte";
  import Button from "$components/assets/buttons/Button.svelte";
  import infoPortfolio from "$lib/localData/portifolio.svelte";

  let pop = $state<any>();
  let nameUser = $state<string>("");

  function nameCursor(){
    localStorage.setItem("username",nameUser);
    mouseState.state.nameCursor=nameUser;
    mouseState.state.haveCustomCursor=true;
    document.body.style.cursor="none"
    pop.drop();

  }
  

  onMount(()=>{
    if(window.innerWidth<900){
      return;
    }
    if(!localStorage.getItem("username")) setTimeout(()=>pop.pop(),2000);
    else{
        mouseState.state.nameCursor = localStorage.getItem("username");
        mouseState.state.haveCustomCursor=true;
    }
  })

</script>

<WrapperPop bind:this={pop}>
    <h1 class="text-24 text-[#2E2E2E]">{infoPortfolio.language==="PT-BR" ? "Insira seu nome/apelido para melhor experiência" : "Type your name/nickname to a better experience"}</h1> 
    <Input bind:value={nameUser}/>
    
    <div class="flex gap-4 mt-2">
      <Button  bg="#8685EF" color="#2E2E2E" label={infoPortfolio.language==="PT-BR" ? "Vamos começar" : "Let's Start"} onClick={nameCursor}/>
      <Button  bg="#FAF8FF" color='#2E2E2E' label={infoPortfolio.language==="PT-BR" ? "Cancelar" : "Cancel"} onClick={()=>{pop.drop()}}/>
    </div>
</WrapperPop>
  