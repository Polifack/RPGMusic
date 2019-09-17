import pyaudio
import sys

from gi.repository import Gtk, GObject
from src.view import View
from src.handler import Handler
from src.model import Model

if __name__ == '__main__':
	import signal #Esto es para cancelar la ventana desde terminal con ctrl+c
	signal.signal(signal.SIGINT, signal.SIG_DFL)
	
	#Llamamos el controller pasando como parametros la vista y el modelo
	GObject.threads_init()
	Handler(View, Model)
	Gtk.main()
