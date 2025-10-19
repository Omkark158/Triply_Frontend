const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface PlaceResult {
  name: string;
  address: string;
  coordinates: Coordinates;
  place_id: string;
}

export const mapsService = {
  // Geocode address to coordinates
  geocodeAddress: async (address: string): Promise<Coordinates | null> => {
    try {
      const geocoder = new google.maps.Geocoder();
      const result = await geocoder.geocode({ address });
      
      if (result.results && result.results.length > 0) {
        const location = result.results[0].geometry.location;
        return {
          lat: location.lat(),
          lng: location.lng(),
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  },

  // Reverse geocode coordinates to address
  reverseGeocode: async (coordinates: Coordinates): Promise<string> => {
    try {
      const geocoder = new google.maps.Geocoder();
      const result = await geocoder.geocode({ location: coordinates });
      
      if (result.results && result.results.length > 0) {
        return result.results[0].formatted_address;
      }
      return 'Unknown location';
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return 'Unknown location';
    }
  },

  // Calculate distance between two points
  calculateDistance: (from: Coordinates, to: Coordinates): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (to.lat - from.lat) * Math.PI / 180;
    const dLng = (to.lng - from.lng) * Math.PI / 180;
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(from.lat * Math.PI / 180) * Math.cos(to.lat * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Math.round(distance * 10) / 10; // Round to 1 decimal place
  },

  // Get map URL for static map image
  getStaticMapUrl: (coordinates: Coordinates, zoom: number = 13): string => {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${coordinates.lat},${coordinates.lng}&zoom=${zoom}&size=600x400&maptype=roadmap&markers=color:red%7C${coordinates.lat},${coordinates.lng}&key=${GOOGLE_MAPS_API_KEY}`;
  },
};