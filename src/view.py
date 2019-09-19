from gi.repository import Gtk, GLib

class TrackPlayer:
    def __init__(self, filename):
        print("* Creating new player view...")

        #State logic
        self.state = 'PLAY'

        #Select file button
        self.file_button = Gtk.Button(label = "FILE")        

        #Play/Pause button
        self.play_button = Gtk.Button(label = self.state)
        self.play_button.connect('clicked', self.execute_function)
        
        #Progress bar
        self.play_progress = Gtk.ProgressBar()

        #File Name Label
        self.label = Gtk.Label(filename)

        #Layout
        box = Gtk.Box(spacing=6, orientation=Gtk.Orientation.HORIZONTAL)
        box.pack_start(self.label, False, False, 0)
        box.pack_start(self.play_button, False, False, 0)
        nowplaybox = Gtk.Box(spacing=6, orientation = Gtk.Orientation.VERTICAL)
        nowplaybox.pack_start(self.play_progress, False, False, 6)
        box.pack_start(nowplaybox, True, True, 6)

        #Visible from outside
        self.track_player = box

    def update_prog_bar(self, value):
        self.play_progress.set_fraction(value)

    def connect(self, play_click, stop_click, file_click):
        self.play_click = play_click
        self.stop_click = stop_click
        self.file_button.connect('clicked', file_click)

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
        self.add_button = Gtk.Button(label = "[+]")
        self.music_players = dict()

        self.main_window = Gtk.Box(spacing=6,orientation=Gtk.Orientation.VERTICAL)
        self.main_window.pack_start(self.add_button, False, False, 0)

        self.win = Gtk.Window(title="RolPlayer")
        self.win.set_default_size(1024, 720)
        self.win.add(self.main_window)
        self.win.connect("destroy", Gtk.main_quit)
        self.win.show_all()

    def connect(self, handler):
        self.add_button.connect('clicked',handler.on_add_player_clicked)
    
    #Adds a new player
    def add_music_player(self, player, file):
        self.music_players[file] = player
        self.main_window.pack_start(player, False, False, 0)
        player.show_all()
