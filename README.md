# Turing Machine Visualizer

Um visualizador interativo de Máquinas de Turing desenvolvido para o projeto **ft_turing** da 42. Esta aplicação permite carregar, visualizar e executar definições de Máquinas de Turing através de uma interface web moderna e intuitiva.

## 🎯 Sobre o Projeto

Este projeto foi desenvolvido como parte do currículo da 42, especificamente para o projeto **ft_turing**. O objetivo é criar uma ferramenta visual que ajude no entendimento e debug de Máquinas de Turing, permitindo:

- **Visualização gráfica** da máquina de estados
- **Execução passo a passo** das transições
- **Visualização da fita** em tempo real
- **Validação** de definições JSON
- **Interface responsiva** e moderna

## 🚀 Tecnologias Utilizadas

- **React 19** com TypeScript
- **Chakra UI 3** para interface
- **D3.js** para visualização de grafos
- **Monaco Editor** para edição de código
- **Vite** para build e desenvolvimento

## 📋 Funcionalidades

- ✅ Carregamento de definições JSON de Máquinas de Turing
- ✅ Visualização gráfica da máquina de estados com zoom
- ✅ Execução automática ou passo a passo
- ✅ Visualização da fita com destaque da posição do cabeçote
- ✅ Validação completa das definições
- ✅ Suporte a transições múltiplas entre estados
- ✅ Auto-loops visuais para transições recursivas
- ✅ Tema claro/escuro

## 🛠️ Como Usar

### Instalação

```bash
# Clone o repositório
git clone https://github.com/PauloDavi/42ft_turing_visualizer.git
cd 42ft_turing_visualizer

# Instale as dependências
npm install

# Execute em modo de desenvolvimento
npm run dev

# Build para produção
npm run build
```

### Definição da Máquina de Turing

A aplicação aceita definições JSON no seguinte formato:

```json
{
  "name": "unary_sub",
  "alphabet": ["1", "-", "=", "."],
  "blank": ".",
  "states": ["scanright", "eraseone", "subone", "skip", "HALT"],
  "initial": "scanright",
  "finals": ["HALT"],
  "transitions": {
    "scanright": [
      {"read": ".", "to_state": "scanright", "write": ".", "action": "RIGHT"},
      {"read": "=", "to_state": "eraseone", "write": ".", "action": "RIGHT"}
    ],
    "eraseone": [
      {"read": "1", "to_state": "subone", "write": "=", "action": "LEFT"}
    ],
    "subone": [
      {"read": ".", "to_state": "subone", "write": ".", "action": "LEFT"},
      {"read": "=", "to_state": "skip", "write": "-", "action": "LEFT"}
    ],
    "skip": [
      {"read": "1", "to_state": "skip", "write": "1", "action": "LEFT"},
      {"read": ".", "to_state": "HALT", "write": ".", "action": "RIGHT"}
    ]
  }
}
```

## 📖 Estrutura do JSON

### Campos Obrigatórios

- **name**: Nome da máquina de Turing
- **alphabet**: Array com símbolos do alfabeto (cada símbolo deve ter 1 caractere)
- **blank**: Símbolo em branco (1 caractere)
- **states**: Array com todos os estados da máquina
- **initial**: Estado inicial (deve estar em `states`)
- **finals**: Array com estados finais (deve haver pelo menos 1)
- **transitions**: Objeto com transições por estado

### Formato das Transições

Cada transição deve conter:
- **read**: Símbolo a ser lido (deve estar no alfabeto ou ser o símbolo em branco)
- **write**: Símbolo a ser escrito (deve estar no alfabeto ou ser o símbolo em branco)
- **to_state**: Estado de destino (deve estar em `states`)
- **action**: Ação do cabeçote (`"LEFT"` ou `"RIGHT"`)

## 🎮 Como Usar a Interface

1. **Carregue uma definição**: Cole o JSON da máquina no editor
2. **Configure a fita inicial**: Digite a entrada na caixa de texto
3. **Carregue a máquina**: Clique em "Carregar Máquina"
4. **Execute**: Use os controles para executar passo a passo ou automaticamente
5. **Visualize**: Observe a fita, estados e transições em tempo real

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Linting
npm run lint
```

## 📝 Validação

A aplicação valida automaticamente:
- Estrutura JSON correta
- Presença de todos os campos obrigatórios
- Símbolos do alfabeto com 1 caractere apenas
- Estados iniciais e finais válidos
- Consistência das transições
- Pelo menos 1 estado final

## 🤝 Contribuição

Este projeto foi desenvolvido como parte do currículo da 42. Contribuições são bem-vindas através de pull requests.

## 📄 Licença

Este projeto é open source e está disponível sob a licença MIT.
