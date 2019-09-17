from gi.repository import Gtk, GLib

class View:

    def __init__(self):
        self.play_button = Gtk.Button(label="PLAY")
        self.play_button.set_sensitive(True)

        self.win = Gtk.Window(title="RolPlayer")
        self.win.add(self.play_button)
        self.win.connect("destroy", Gtk.main_quit)
        self.win.show_all()

    def connect(self, handler):
        self.play_button.connect('clicked', handler.on_play_clicked)