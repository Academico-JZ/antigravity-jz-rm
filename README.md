# 🌌 Antigravity Kit (JZ e RM Edition)

> **A fusão definitiva entre o `Awesome Skills` e o `Antigravity Kit`. 255+ Skills, 20 Agentes e 11+ Workflows em um único ambiente de alta performance.**

---

## 🐣 O que é este Kit?

Este repositório é uma versão consolidada e otimizada do ecossistema Antigravity. Ele combina a vasta biblioteca de habilidades (skills) da comunidade com a orquestração multi-agente para transformar seu assistente de IA em uma agência digital completa.

**Diferenciais desta versão:**
- ✅ **Portabilidade Total:** Scripts refatorados para funcionar em qualquer máquina sem caminhos fixos.
- ✅ **Sem Dependência de Git:** Sincronização automática via download de ZIP para ambientes restritos.
- ✅ **Híbrido (PowerShell + Node):** Comandos nativos para Windows ou via NPM para devs web.

---

## 🚀 Quick Install (Unified JZ-RM Edition)

Escolha o modo que melhor se adapta ao seu fluxo de trabalho:

### Instalação Unificada

O Antigravity JZ-RM é um **Aggregator Inteligente** que orquestra a instalação do core oficial e o anaboliza com a biblioteca completa de skills e regras de governança.

### 🚀 Opção A: Instalação Local (No Projeto)
Ideal para projetos específicos. Instala tudo na pasta `.agent/` do seu diretório atual.

```bash
npx github:Academico-JZ/ag-jz-rm init --local
```
*(Ideal para projetos isolados ou que exigem versões específicas das skills sem afetar o resto do sistema)*

### 🌌 Opção B: Instalação Global (Permanente)
Ideal para ter acesso ao kit em qualquer terminal.

```bash
npm install -g github:Academico-JZ/ag-jz-rm
ag-jz-rm init
```

## O que torna esta edição especial?

1.  **Core Oficial + Turbo Skills:** Combina a base do `@vudovn/ag-kit` com as 255+ skills do `sickn33/antigravity-awesome-skills`.
2.  **Skill Discovery:** Regras customizadas no `GEMINI.md` que permitem ao agente encontrar qualquer skill via index, mesmo que não esteja carregada no contexto imediato.
3.  **Zero-Friction:** Instalação limpa, sem avisos de NPM e com indexação automática.
4.  **PowerShell Native:** Instalador robusto para usuários Windows.

## Comandos CLI

| Comando | Descrição |
|---------|-------------|
| `ag-jz-rm init --local` | Instalação local no projeto atual |
| `ag-jz-rm init` | Instalação global e link de workspace |

---

## 🏗️ Como vincular a um novo projeto (Modular)

Agora o Antigravity JZ-RM é **reutilizável**. Uma vez que você tenha instalado globalmente, você não precisa baixar tudo de novo para cada projeto.

1. Vá para a pasta do seu novo projeto.
2. Execute o comando de linkagem:
   ```bash
   ag-jz-rm link
   ```
3. **Automação Zero-Touch:** Se você estiver usando o Agente JZ-RM, nem precisa rodar o comando! O motor interno realiza um **"Playground Vacuum"** periódico. Se você abrir um novo workspace no playground, eu detectarei a ausência do controlador e realizarei a linkagem modular instantaneamente.

*(Isso transforma seu playground em um cluster inteligente onde todo novo projeto já nasce "anabolizado" pelo Kit)*

---

## 🛠️ Comandos Slash (Workflows)

| Comando | Descrição |
| :--- | :--- |
| `/plan` | Cria um plano técnico detalhado sem escrever código. |
| `/brainstorm` | Processo de discovery socrático para validar ideias. |
| `/create` | Orquestra a criação de uma nova aplicação do zero. |
| `/debug` | Modo de depuração sistemática com análise de causa raiz. |
| `/ui-ux-pro-max` | Foco em estética premium e animações. |

---

## 🔄 Sincronização

Mantenha suas skills sempre atualizadas baixando as novidades dos repositórios originais:
```bash
python .agent/scripts/sync_kits.py
```

---

## 🤝 Créditos
Inspirado pelos trabalhos de **[sickn33](https://github.com/sickn33)** e **[vudovn](https://github.com/vudovn)**.
Refatorado e modularizado por **[Academico-JZ](https://github.com/Academico-JZ)** e **[RMMeurer](https://github.com/rmmeurer)**.

> Este projeto opera sob a licença MIT, respeitando as liberdades dos códigos originais.
