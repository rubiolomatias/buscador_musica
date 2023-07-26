const app = Vue.createApp({
    data() {
      return {
        logo: "./img/logo-musicbrain.svg",
        textoInput: "",
        canciones: [],
        discografia: [],
        banda: {
          nombre: "",
          fechaCreacion: "",
        },
        mostrarCanciones: true,
        mostrarAlbunes: false,
        mostrarInfo: false
      }
    },
    computed: {
        apiBuscarCancion() {
            return "https://musicbrainz.org/ws/2/recording?fmt=json&query=" + this.textoInput;
        }
    },
    methods: {
        buscarCancion() {
          this.mostrarCanciones=true;
          this.mostrarAlbunes = false;
          this.mostrarInfo = false;
            fetch(this.apiBuscarCancion)
            .then(response => {
                if (!response.ok) {
                throw new Error('La solicitud no fue exitosa.');
                }
                return response.json();
            })
            .then(data => {
                if (data.recordings && data.recordings.length > 0) {
                    this.canciones = data.recordings.map(cancion => ({
                    titulo: cancion.title,
                    artista: cancion["artist-credit"][0].name,
                    duracion: cancion.length/1000 + " Seg.",
                    idArtista : cancion["artist-credit"][0].artist.id
                    }));
                } else {
                    this.canciones = [];
                }
            })
            .catch(error => {
                console.error('Error al llamar a la API:', error);
            });
        },
        mostrarDiscografia(idArtista) {
          this.mostrarAlbunes = true
          const apiUrl = `https://musicbrainz.org/ws/2/release?artist=${idArtista}&fmt=json&type=album`;
                
          fetch(apiUrl)
            .then(response => {
              if (!response.ok) {
                throw new Error('La solicitud no fue exitosa.');
              }
              return response.json();
            })
            .then(data => {
              if (data.releases && data.releases.length > 0) {
                this.discografia = data.releases.map(album => ({
                  titulo: album.title,
                  fecha: album.date ? album.date : 'Fecha desconocida',
                }));
              } else {
                this.discografia = [];
              }
              this.mostrarCanciones = false;
            })
            .catch(error => {
              console.error('Error al llamar a la API:', error);
            });
        },
        infoArtista(idArtista) {
          this.mostrarInfo = true;
    
          const apiUrl = `https://musicbrainz.org/ws/2/artist/${idArtista}?fmt=json&inc=genres`;
    
          fetch(apiUrl)
            .then(response => {
              if (!response.ok) {
                throw new Error('La solicitud no fue exitosa.');
              }
              return response.json();
            })
            .then(data => {
              this.banda.nombre = data.name;
              this.banda.fechaCreacion = data["life-span"] ? data["life-span"].begin : 'Fecha desconocida';
            })
            .catch(error => {
              console.error('Error al llamar a la API:', error);
            });
        }
    }
});