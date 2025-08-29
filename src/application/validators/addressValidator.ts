import { AddressDto } from "../../application/dto/user/AddressDto";

export function validateAddress(addressData: AddressDto): Record<string, string> {
    const { name, phone, line1, city, country, state, postalCode } = addressData;
    const errors: Record<string, string> = {};

    if (!name || name.length < 3 || name.length > 43) {
        errors.name = "Name must be 3-43 characters long.";
    }

    if (!phone || !/^\d{10}$/.test(phone)) {
        errors.phone = "Phone must be exactly 10 digits.";
    }

    if (!line1 || line1.length < 8 || line1.length > 43) {
        errors.line1 = "Address Line 1 must be 8-43 characters long.";
    }

    if (!city) {
        errors.city = "City is required.";
    } else if (city.length < 3 || city.length > 43) {
        errors.city = "City name must be 3-43 characters long.";
    }

    if (!state) {
        errors.state = "State is required.";
    } else if (state.length < 3 || state.length > 43) {
        errors.state = "State name must be 3-43 characters long.";
    }

    if (!country) {
        errors.country = "Country is required.";
    }

    if (!postalCode || !/^\d{6}$/.test(postalCode)) {
        errors.postalCode = "Postal Code must be exactly 6 digits.";
    }

    return errors;
}
    