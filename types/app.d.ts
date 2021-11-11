interface UserDetails {
  role: 'DELIVERY' | 'ADMIN' | 'USER',
  phone: string
}
interface UserDetailsExtended extends UserDetails {
  uid: string
}