import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

export default (props: any) => {
  return (
    <CKEditor
      {...props}
      onChange={(_, editor: any) => {
        const data = editor.getData()
        props.setData(data)
      }}
      editor={ClassicEditor}
    />
  )
}

//export default EditorCK

// import { useState } from 'react'
// import ReactQuill from 'react-quill'
// import 'react-quill/dist/quill.snow.css'

// const Editor = () => {
//   const [value, setValue] = useState('')

//   return (
//     <ReactQuill
//       theme='snow'
//       value={value}
//       onChange={setValue}
//     />
//   )
// }

// export default Editor
