import Stack, { StackProps } from '@mui/material/Stack';

const Column = (props: StackProps) => {
  return (
    <Stack
      direction='column'
      {...props}
    >
      {props.children}
    </Stack>
  );
};

export default Column