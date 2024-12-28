use std::env::current_dir;
use std::fs::File;
use std::io::BufReader;
use std::thread::{self, park_timeout};
use tauri::AppHandle;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(app: AppHandle) -> () {
    tauri::WebviewWindowBuilder::new(
        &app,
        "Something",
        tauri::WebviewUrl::App("/scoreboard/projection".into()),
    )
    .build()
    .unwrap();
}

#[tauri::command]
fn play_airhorn(_app: AppHandle) -> () {
    thread::spawn(|| {
        let dir = current_dir().unwrap();
        let audio = dir.display().to_string() + "/audios/air_horn.mp3";
        let file = File::open(audio).unwrap();
        let source = rodio::Decoder::new(BufReader::new(file)).unwrap();
        let (_stream, stream_handle) = rodio::OutputStream::try_default().unwrap();
        let sink = rodio::Sink::try_new(&stream_handle).unwrap();
        sink.append(source);
        sink.play();
        loop {
            park_timeout(std::time::Duration::from_secs(4));
            break;
        }
    });
}

#[tauri::command]
fn play_whistle(_app: AppHandle) -> () {
    thread::spawn(|| {
        let dir = current_dir().unwrap();
        let audio = dir.display().to_string() + "/audios/whistle.mp3";
        let file = File::open(audio).unwrap();
        let source = rodio::Decoder::new(BufReader::new(file)).unwrap();
        let (_stream, stream_handle) = rodio::OutputStream::try_default().unwrap();
        let sink = rodio::Sink::try_new(&stream_handle).unwrap();
        sink.append(source);
        sink.play();
        loop {
            park_timeout(std::time::Duration::from_secs(4));
            break;
        }
    });
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, play_airhorn, play_whistle])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
