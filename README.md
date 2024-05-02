# color-plugin-editorjs

with help of this package you be able to change your text colors 

## How to use 

```javascript
import { ColorTool } from "color-plugin-editorjs"


const editor = new EditorJS({ 
//...rest of your code
  
  tools: { 
    color : {
      class : ColorTool ,
      config : {
        icon : //your icon path (SVG ,image , ...)  OPTIONAL
    }, 
  }

//...rest of your code
})
```

## Installation

```bash
npm install color-plugin-editorjs
```
