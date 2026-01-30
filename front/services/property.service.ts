import axios from "axios";

import { PropertyCreateDTO, PropertyUpdateDTO } from "@/dto/property/create.dto";
import { PropertyListItemDto } from "@/dto/property/property-list-item.dto";
import { Property } from "@/models/property.model";

class PropertyService {
  static async getAll(): Promise<PropertyListItemDto[]> {
    return axios
      .get<PropertyListItemDto[]>("/api/properties")
      .then((response) => response.data);
  }

  static async getById(id: string): Promise<Property> {
    return axios
      .get<Property>(`/api/properties/${id}`)
      .then((response) => response.data);
  }

  static async create(data: PropertyCreateDTO): Promise<Property> {
    return axios
      .post<Property>("/api/properties", data)
      .then((response) => response.data);
  }

  static async update(id: string, data: PropertyUpdateDTO): Promise<Property> {
    if (!id) {
      throw new Error("Property id is required");
    }

    return axios
      .patch<Property>(`/api/properties/${id}`, data)
      .then((response) => response.data);
  }

  static async delete(id: string): Promise<void> {
    if (!id) {
      throw new Error("Property id is required");
    }

    return axios.delete(`/api/properties/${id}`).then(() => undefined);
  }
}

export default PropertyService;
