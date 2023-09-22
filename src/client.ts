import { setContext } from '@apollo/client/link/context'
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'

const uri = setContext(() => ({
  // uri: 'https://erudite-tome-279803.uc.r.appspot.com/graphql/',
  uri: 'http://localhost:8005/graphql/',
}))

export const client = new ApolloClient({
  link: ApolloLink.from([uri, new HttpLink({ credentials: 'same-origin' })]),
  cache: new InMemoryCache(),
})
