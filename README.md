# Turing Machine Visualizer

An interactive Turing Machine visualizer developed for the **ft_turing** project at 42. This application allows you to load, visualize, and execute Turing Machine definitions through a modern and intuitive web interface.

## 🎯 About the Project

This project was developed as part of the 42 curriculum, specifically for the **ft_turing** project. The goal is to create a visual tool that helps in understanding and debugging Turing Machines, allowing:

- **Graphical visualization** of the state machine
- **Step-by-step execution** of transitions
- **Real-time tape visualization**
- **JSON definition validation**
- **Responsive and modern interface**

## 🚀 Technologies Used

- **React 19** with TypeScript
- **Chakra UI 3** for interface
- **D3.js** for graph visualization
- **Monaco Editor** for code editing
- **Vite** for build and development

## 📋 Features

- ✅ Loading JSON definitions of Turing Machines
- ✅ Graphical visualization of state machine with zoom
- ✅ Automatic or step-by-step execution
- ✅ Tape visualization with head position highlighting
- ✅ Complete definition validation
- ✅ Support for multiple transitions between states
- ✅ Visual auto-loops for recursive transitions
- ✅ Light/dark theme
- ✅ Internationalization (Portuguese/English)

## 🛠️ How to Use

### Installation

```bash
# Clone the repository
git clone https://github.com/PauloDavi/42ft-turing-visualizer.git
cd 42ft-turing-visualizer

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build
```

### Turing Machine Definition

The application accepts JSON definitions in the following format:

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

## 📖 JSON Structure

### Required Fields

- **name**: Turing machine name
- **alphabet**: Array with alphabet symbols (each symbol must be 1 character)
- **blank**: Blank symbol (1 character)
- **states**: Array with all machine states
- **initial**: Initial state (must be in `states`)
- **finals**: Array with final states (must have at least 1)
- **transitions**: Object with transitions per state

### Transition Format

Each transition must contain:
- **read**: Symbol to be read (must be in alphabet or be the blank symbol)
- **write**: Symbol to be written (must be in alphabet or be the blank symbol)
- **to_state**: Destination state (must be in `states`)
- **action**: Head action (`"LEFT"` or `"RIGHT"`)

## 🎮 How to Use the Interface

1. **Load a definition**: Paste the machine JSON in the editor
2. **Configure initial tape**: Type the input in the text box
3. **Load the machine**: Click "Load Machine"
4. **Execute**: Use controls to execute step by step or automatically
5. **Visualize**: Observe the tape, states, and transitions in real time

## 🔧 Available Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview build
npm run preview

# Linting
npm run lint
```

## 📝 Validation

The application automatically validates:
- Correct JSON structure
- Presence of all required fields
- Alphabet symbols with only 1 character
- Valid initial and final states
- Transition consistency
- At least 1 final state

## 🌐 Internationalization

The application supports:
- **Portuguese (pt-BR)**: Default language
- **English (en-US)**: Alternative language

Use the language selector button in the top-right corner to switch between languages.

## 🤝 Contributing

This project was developed as part of the 42 curriculum. Contributions are welcome through pull requests.

## 📄 License

This project is open source and available under the MIT license.
