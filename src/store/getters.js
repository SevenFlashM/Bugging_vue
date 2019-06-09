const getters = {
  token: state => state.user.token,
  roles: state => state.user.roles,
  project:state => state.project.projectID,
}
export default getters
