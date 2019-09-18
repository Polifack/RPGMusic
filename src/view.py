from gi.repository import Gtk, GLib

class TrackPlayer:
    def __init__(self):
        #State logic
        self.state = 'PLAY'

        #Play/Pause button
        self.play_button = Gtk.Button(label = self.state)
        self.play_button.connect('clicked', self.execute_function)
        
        #Progress bar
        self.play_progress = Gtk.ProgressBar()

        #Layout
        box = Gtk.Box(spacing=6, orientation=Gtk.Orientation.HORIZONTAL)
        box.pack_start(self.play_button, False, False, 0) #child, expand, fill, padding
        nowplaybox = Gtk.Box(spacing=6, orientation = Gtk.Orientation.VERTICAL)
        nowplaybox.pack_start(self.play_progress, False, False, 6)
        box.pack_start(nowplaybox, True, True, 6)

        #Visible from outside
        self.track_player = box

    def update_prog_bar(self, value):
        self.play_progress.set_fraction(value)

    def connect(self, play_click, stop_click):
        self.play_click = play_click
        self.stop_click = stop_click

    def execute_function(self, button):
        if (self.state == 'STOP'):
            self.stop_click(self.play_button)
        elif (self.state == 'PLAY'):
            self.play_click(self.play_button)

    def change_state(self):
        if (self.state == 'STOP'):
            self.state = 'PLAY'
        elif (self.state == 'PLAY'):
            self.state = 'STOP'
            self.update_prog_bar(0)
        
        self.play_button.set_label(self.state)

class View:
    def __init__(self):
        ##TRACK PLAYER
        self.player = TrackPlayer()

        self.win = Gtk.Window(title="RolPlayer")
        self.win.add(self.player.track_player)
        self.win.connect("destroy", Gtk.main_quit)
        self.win.show_all()

    def connect(self, handler):
        self.player.connect(handler.on_play_clicked, handler.on_stop_clicked)