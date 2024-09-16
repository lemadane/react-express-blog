import { Grid2 as Grid } from '@mui/material'
import { GridProps } from '@mui/material/Grid'

const Item = (props: GridProps) => {
  return (
    <Grid
      item
      {...props}
    >
      {props.children}
    </Grid>
  )
}

export default Item
