use std::fs::File;
use std::io::BufReader;
use std::thread::{self, park_timeout};
use tauri::path::BaseDirectory;
use tauri::{AppHandle, Manager};

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
fn play_airhorn(app: AppHandle) -> () {
    let resource_path = app
        .path()
        .resolve("audios/air_horn.mp3", BaseDirectory::Resource)
        .unwrap();
    thread::spawn(|| {
        let file = File::open(resource_path).unwrap();
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
fn play_whistle(app: AppHandle) -> () {
    let resource_path = app
        .path()
        .resolve("audios/whistle.mp3", BaseDirectory::Resource)
        .unwrap();
    thread::spawn(|| {
        let file = File::open(resource_path).unwrap();
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
fn get_path(app: AppHandle) -> String {
    return app
        .path()
        .resolve("/", BaseDirectory::Resource)
        .unwrap()
        .to_string_lossy()
        .to_string();
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            play_airhorn,
            play_whistle,
            get_path
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
