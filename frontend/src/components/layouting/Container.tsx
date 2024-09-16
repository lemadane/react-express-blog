      import { Grid2 as Grid } from '@mui/material'
      import { GridProps } from '@mui/material/Grid'

      const Container = (props: GridProps) => {
        return (
          <Grid
            container
            {...props}
          >
            {props.children}
          </Grid>
        );
      };

      export default Container