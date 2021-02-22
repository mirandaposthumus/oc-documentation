import {
  Avatar,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core/'
import { graphql, useStaticQuery } from 'gatsby'
import React from 'react'
import { Helmet } from 'react-helmet'
import Layout from '../components/Layout/Layout'
import { mediumgrey, seafoam } from '../theme/ocPalette.constants'
import utility from '../services/utility'
import Jumbotron from '../components/Shared/Jumbotron'
import Case from 'case'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    body: {
      overflowX: 'hidden',
    },
    html: {
      overflowX: 'hidden',
    },
    blogContainer: {
      marginTop: -theme.spacing(14),
      paddingBottom: theme.spacing(16),
    },
    title: {
      marginBottom: theme.spacing(1),
    },
    subtitle: {
      color: mediumgrey[400],
    },
    cardBase: {
      display: 'flex',
      flexFlow: 'column nowrap',
      transition: '0.3s',
      margin: 'auto',
      height: '100%',
      boxShadow: '0 0 20px 0 rgba(0,0,0,0.12)',
      '&:hover': {
        transform: 'translateY(-3px)',
        boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
      },
    },
    cardActionArea: {
      flex: '1 1 auto',
    },
    cardImg: {
      paddingTop: '56.25%',
      position: 'relative',

      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundImage: `linear-gradient(120deg, #ffffff 0, #bce6e6 100%)`,
        opacity: 0.5,
      },
      '&::after': {
        content: '" "',
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        borderBottom: '32px solid #ffffff',
        borderLeft: '400px solid transparent',
      },
    },
    cardRibbon: {
      position: 'absolute',
      top: theme.spacing(2),
      left: theme.spacing(2),
      backgroundColor: seafoam[800],
      color: seafoam[100],
      fontSize: '.8em',
      padding: '2px 8px 4px 8px',
      boxShadow: '0 2px 12px 2px rgba(0,0,0,0.5)',
      borderTopLeftRadius: 2,
      borderBottomLeftRadius: 2,
      margin: 0,
    },
    cardAuthor: {
      position: 'absolute',
      right: '12%',
      bottom: 4,
      transform: 'translateY(20%)',
      width: 48,
      height: 48,
      zIndex: 1,
      boxShadow: theme.shadows[2],
      '&:after': {
        content: '" "',
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
      },
    },
    cardAuthorImage: {
      objectPosition: 'top',
    },
    cardTitle: {
      lineHeight: '1.4',
    },
    MuiCardContentRoot: {
      textAlign: 'left',
      padding: theme.spacing(3),
    },
    MuiCardActionsRoot: {
      padding: theme.spacing(2, 3),
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  })
)

interface PageData {
  allMdx: {
    totalCount: number
    edges: [
      {
        node: {
          id: string
          fileAbsolutePath: string
          frontmatter: {
            featuredImage: string
            title: string
            publishDate: string
            updatedOnDate: string
            tags: string
            authors: string
            jobTitle: string
            summary: string
          }
        }
      }
    ]
  }
}

const placeholderImg = '/images/blog/thumbnails/placeholder.jpg'

interface BlogListProps {
  location: any
}

export default function BlogListComponent(props: BlogListProps) {
  const classes = useStyles({})
  const data: PageData = useStaticQuery(graphql`
    query {
      allMdx(
        sort: { order: DESC, fields: [frontmatter___publishDate] }
        filter: { fileAbsolutePath: { glob: "**/content/blog/**/*.mdx" } }
      ) {
        totalCount
        edges {
          node {
            id
            fileAbsolutePath
            frontmatter {
              featuredImage
              title
              publishDate(formatString: "MMMM Do, YYYY")
              tags
              authors
              jobTitle
              summary
            }
          }
        }
      }
    }
  `)
  return (
    <Layout location={props.location}>
      <Helmet
        title={`OrderCloud Blog`}
        meta={[
          {
            name: 'description',
            content:
              'New feature announcements, tips & tricks, and best practices to help developers get the most out of the OrderCloud platform.',
          },
        ]}
      />
      <Jumbotron
        heading="OrderCloud Blog"
        text="New feature announcements, tips & tricks, and best practices to help developers get the most out of the OrderCloud platform."
      />
      <Container className={classes.blogContainer}>
        <Grid container spacing={3}>
          {data.allMdx.edges.map(edge => {
            const authorImage = `/images/blog/authors/${Case.kebab(
              edge.node.frontmatter.authors
            )}.jpg`
            return (
              <Grid item sm={6} md={4} lg={3} key={edge.node.id}>
                <Card className={classes.cardBase}>
                  <CardActionArea
                    className={classes.cardActionArea}
                    href={utility.resolvePath(edge.node.fileAbsolutePath)}
                  >
                    <CardMedia
                      className={classes.cardImg}
                      image={
                        edge.node.frontmatter.featuredImage || placeholderImg
                      }
                    >
                      <Avatar
                        classes={{
                          img: classes.cardAuthorImage,
                        }}
                        className={classes.cardAuthor}
                        src={authorImage}
                      />
                    </CardMedia>
                    <CardContent className={classes.MuiCardContentRoot}>
                      <Typography
                        className={classes.cardTitle}
                        gutterBottom
                        variant="h5"
                      >
                        {edge.node.frontmatter.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        dangerouslySetInnerHTML={{
                          __html: edge.node.frontmatter.summary,
                        }}
                      />
                    </CardContent>
                  </CardActionArea>
                  <CardActions className={classes.MuiCardActionsRoot}>
                    <Typography variant={'caption'}>
                      {edge.node.frontmatter.publishDate}
                    </Typography>
                  </CardActions>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      </Container>
    </Layout>
  )
}
