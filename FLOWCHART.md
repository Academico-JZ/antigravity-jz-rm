# 📊 Fluxograma Cronológico de Operação - Antigravity Kit (JZ Edition)

Este documento descreve a linha do tempo exata, desde o comando inicial até a ativação da IA em um projeto.

---

## 1. Fluxo Cronológico (Lifecycle)

```mermaid
graph TD
    %% Passo 1
    P1[1. Comando de Inicialização] -- "irm | iex" --> P2[2. Download do Core JZ]
    
    %% Passo 2
    subgraph "Fase de Instalação (Base)"
        P2 --> P2A[Cria pastas em $HOME/.gemini]
        P2A --> P2B[Extrai scripts, regras e GEMINI.md JZ]
    end

    %% Passo 3
    P2B --> P3[3. Fase de Unificação - Hydration]
    
    subgraph "Fase de Unificação (Scripts de Sincronismo)"
        P3 -- "Chama sync_kits.py" --> P3A[Busca Agentes/Workflows - vudovn]
        P3 -- "Chama sync_kits.py" --> P3B[Busca 250+ Skills - sickn33]
        P3A --> P3C[Merge Inteligente de Arquivos]
        P3B --> P3C
        P3C --> P3D[Preservação das Regras JZ Edition]
    end

    %% Passo 4
    P3D --> P4[4. Estado Final: Kit Global PRONTO]
    
    %% Passo 5
    P4 -- "Usuário executa em novo projeto" --> P5[5. Linkagem de Workspace]
    
    subgraph "Uso no Projeto"
        P5 -- "setup_workspace.ps1" --> P5A[Criação da pasta .agent local]
        P5A --> P5B[Mapeamento via .pointer]
        P5B --> P5C[IA Ativa com Habilidades Integradas]
    end
```

---

## 2. Detalhamento dos Estágios

### Estágio 1: O Gatilho
Tudo começa com o comando de uma linha no terminal. Ele é o ponto de entrada que prepara o ambiente e solicita os recursos iniciais do repositório **Academico-JZ/antigravity-jz**.

### Estágio 2: A Fundação (Base JZ)
Nesta fase, o instalador cria a estrutura de diretórios necessária e baixa o "cérebro" do sistema: o seu `GEMINI.md` personalizado e os scripts de portabilidade. **Neste momento, o kit ainda está "vazio" de habilidades externas.**

### Estágio 3: A Unificação (O Pulo do Gato)
O script `sync_kits.py` entra em ação automaticamente (ou via trigger):
1. Ele viaja até o repositório original do **Vudovn** e busca a orquestração de agentes.
2. Ele viaja até o repositório **Awesome Skills** e busca as centenas de habilidades.
3. Ele realiza o **Merge**: Insere as peças baixadas dentro da sua instalação, mas mantém o `GEMINI.md` e os scripts do JZ Edition como as regras soberanas.

### Estágio 4: O Kit Global
Agora a máquina tem uma biblioteca completa (Kit Original + Skills + Regras JZ) centralizada na pasta de usuário (`$HOME`). Ela está pronta para ser usada por qualquer projeto na mesma máquina.

### Estágio 5: Ativação no Projeto
Quando você inicia um código novo:
- O `setup_workspace.ps1` é executado na pasta do projeto.
- Ele "virtualiza" o kit, criando um vínculo entre o projeto local e a instalação global.
- **Final:** A IA entra no projeto, lê os arquivos de linkagem e passa a ter acesso a tudo o que foi unificado nas fases anteriores.

---

## 3. Resultado Final
Ao final deste fluxo, o usuário tem um assistente de IA que:
- Segue as regras do **JZ Edition**.
- Usa a estrutura do **Kit Original**.
- Possui o conhecimento das **250+ Skills**.
- É **portátil** e fácil de atualizar.
