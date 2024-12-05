export default async ({ store, redirect, $axios, route }) => {
  // console.log('::: session ', req.session.user);
  console.log('::: i got called', store.state.currentUser)
  console.log(':::: baseUrl ', process.env.baseUrl)
  console.log(':::: serverUrl ', process.env.serverUrl)
  console.log('::: env ', process.env.NODE_ENV)
  console.log(':::: route ', route)

  const noLoginNeeded = ['login', 'error']
  const adminNeeded = ['menu', 'meals', 'orders', 'users']

  if (process.env.NODE_ENV === 'development') { return }

  if (!store.state.currentUser && !noLoginNeeded.includes(route.name)) {
    // :::: check if logged in
    try {
      const { data } = await $axios.get(`/api/ownProfile`).catch(error => {
        console.log('::: oops?', error)
      })
      console.log('::: data', data)
      if (data) {
        store.commit('setUser', data)
      } else {
        console.log('::: no user data found somehow. very unlikely.')
        return redirect('/login')
      }
    } catch (e) {
      console.log('::: not logged in')
      return redirect('/login')
    }
  }

  if (adminNeeded.includes(route.name)) {
    // :::: check if admin type user
    if (!store.state.currentUser) {
      console.log('::: not logged in')
      return redirect('/login')
    } else if (store.state.currentUser.userType !== 'Admin') {
      console.log('::: not admin')
      return redirect('/')
    }
  }

  if (store.state.currentUser && route.name == 'index') {
    if (store.state.currentUser.userType == 'Admin') return redirect('/menu')
  }

}
