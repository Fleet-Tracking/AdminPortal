interface UserDetails {
  role: 'DELIVERY' | 'ADMIN',
  phone: string
}
interface UserDetailsExtended extends UserDetails {
  uid: string
}