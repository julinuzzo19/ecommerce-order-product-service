export interface CustomerResponseDTO {
  id: string;
  name: string;
  email: string;
  address: AddressResponseDTO;
  phoneNumber?: string;
}

export interface AddressResponseDTO {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}
