import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

export default (props: any) => {
  return (
    <ReactQuill
      {...props}
      theme='snow'
      value={props.data}
      onChange={props.setData}
    />
  )
}