import sys

from gi.repository import GLib

class Handler:
    #Constructor. Inicializamos la vista y el modelo.
    def __init__(self, v, m):
        self.view = v()
        self.model = m()
        self.view.connect(self)
    
    #Nota: Todas los metodos de una clase en python llevan como primer argumento a si misma
    def on_play_clicked(self, button):
        self.model.play(sys.argv[1])