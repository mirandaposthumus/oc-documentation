import React from 'react'
import {
  createStyles,
  makeStyles,
  Theme,
  Typography,
  Button,
  Box,
} from '@material-ui/core'
import ButtonLink from '../../Shared/ButtonLink'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: (props: any) => ({
      display: 'flex',
      flexFlow: 'column nowrap',
      justifyContent: 'center',
      flex: '1 1 auto',
      padding: theme.spacing(4),
      textAlign: 'center',
      color: props.darkMode
        ? theme.palette.getContrastText(theme.palette.primary.main)
        : undefined,
    }),
    title: {
      marginBottom: theme.spacing(2),
    },
    button: {
      margin: theme.spacing(0, 1),
    },
  })
)

interface DocSearchFooterProps {
  darkMode: boolean
}
const DocSearchFooter: React.FunctionComponent<DocSearchFooterProps> = ({
  darkMode,
}: DocSearchFooterProps) => {
  const classes = useStyles({ darkMode })
  return (
    <footer className={classes.root}>
      <Box flex="0">
        <Typography variant="h5" color="inherit" className={classes.title}>
          Trouble finding something?
        </Typography>
        <ButtonLink
          size="small"
          variant={darkMode ? 'contained' : 'outlined'}
          className={classes.button}
          to="/slack"
        >
          Join Our Community
        </ButtonLink>

        <Button
          className={classes.button}
          variant={darkMode ? 'contained' : 'outlined'}
          href="https://stackoverflow.com/questions/tagged/ordercloud"
          target="_blank"
          rel="noreferrer"
          size="small"
          color="secondary"
        >
          Ask on Stack Overflow
        </Button>
      </Box>
    </footer>
  )
}

export default DocSearchFooter
