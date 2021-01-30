const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  graphql,
} = require('graphql')

const app = express()

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log('listening on http://localhost:3000'))

const users = [
  { id: 1, name: 'Saad', age: 23 },
  { id: 1, name: 'Muaz', age: 20 },
  { id: 1, name: 'Hammad', age: 13 },
  { id: 1, name: 'Hammad', age: 8 },
]

// only two main things: SCEMA and TYPES
const userType = new GraphQLObjectType({
  name: 'UserType',
  description: 'You can give any description',
  fields: {
    id: {
      type: GraphQLInt,
    },
    name: {
      type: GraphQLString,
    },
    age: {
      type: GraphQLInt,
    },
  },
})

var userSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      hello: {
        type: GraphQLString,
        resolve(parent, args) {
          return 'world'
        },
      },
      users: {
        type: new GraphQLList(userType),
        resolve: (parent, args) => users,
      },
      user: {
        type: userType,
        args: {
          id: {
            type: GraphQLInt,
          },
        },
        resolve: (parent, { id }) => users.filter((user) => user.id === id)[0],
      },
    },
  }),
})

app.use(
  '/graphql',
  graphqlHTTP({
    schema: userSchema,
    graphiql: true,
  })
)

app.get('/graphql', (req, res) => {
  res.send({
    ding: 'dong',
  })
})

app.get('/', async (req, res) => {
  const query = `{ users { name } }`
  const data = await graphql(userSchema, query)
  res.send(data)
})

app.get('/:id', async (req, res) => {
  const query = `{ user(id: ${req.params.id}) { name } }`
  const data = await graphql(userSchema, query)
  res.send(data)
})
