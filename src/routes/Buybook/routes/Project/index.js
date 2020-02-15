Learn more or give us feedback
import { Loadable } from 'utils/components'

export default {
  path: ':projectId',
  component: Loadable({
    loader: () =>
      import(/* webpackChunkName: 'Project' */ './components/ProjectPage')
  })
}
