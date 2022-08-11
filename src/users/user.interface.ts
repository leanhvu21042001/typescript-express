interface User {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  name: string;
  email: string;
  password: string;
  address?: {
    street: string;
    city: string;
  };
}

export default User;
