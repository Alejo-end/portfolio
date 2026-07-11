// MIDIHost2Host firmware, from the electronics production write-up:
// https://digital-fabrication-1baba0.gitlab.io/assignments/08_electronics-production.html
export const midihostFirmware = `// MIDIHost2Host -- Seeed XIAO RP2040
// Forwards MIDI between USB and hardware Serial1 (D6=TX, D7=RX)

#include <Arduino.h>
#include <Adafruit_TinyUSB.h>
#include <MIDI.h>

// --- Board selection ---
//#define RED_BOARD
#define BLUE_BOARD

// --- XIAO RP2040 onboard RGB LED pins (active LOW) ---
#define LED_R_PIN  17
#define LED_G_PIN  16
#define LED_B_PIN  25

// --- Board identity ---
#ifdef RED_BOARD
  char mfgstr[32] = "Alejandro?";
  char prodstr[32] = "2Host Red";
#else
  char mfgstr[32] = "Alejandro?";
  char prodstr[32] = "2Host Blue";
#endif

// --- USB MIDI + Hardware Serial1 ---
Adafruit_USBD_MIDI usb_midi;
MIDI_CREATE_INSTANCE(Adafruit_USBD_MIDI, usb_midi, midiA);
MIDI_CREATE_INSTANCE(HardwareSerial,     Serial1,  midiB);

// --- LED blink state ---
bool     led_on      = false;
uint32_t led_time    = 0;
uint32_t led_on_time = 50;

// --- RGB LED helpers (active LOW) ---
void set_rgb(bool r, bool g, bool b) {
  digitalWrite(LED_R_PIN, r ? LOW : HIGH);
  digitalWrite(LED_G_PIN, g ? LOW : HIGH);
  digitalWrite(LED_B_PIN, b ? LOW : HIGH);
}

void flash_color(bool r, bool g, bool b) {
  set_rgb(r, g, b);
  led_on   = true;
  led_time = millis();
}

void led_check() {
  if (led_on && (millis() - led_time) > led_on_time) {
    led_on = false;
    // Return to idle color
    #ifdef RED_BOARD
      set_rgb(true, false, false);  // dim red idle
    #else
      set_rgb(false, false, true);  // dim blue idle
    #endif
  }
}

void setup() {
  Serial.begin(115200);

  pinMode(LED_R_PIN, OUTPUT);
  pinMode(LED_G_PIN, OUTPUT);
  pinMode(LED_B_PIN, OUTPUT);

  // Yellow = booting
  set_rgb(true, true, false);

  USBDevice.setManufacturerDescriptor(mfgstr);
  USBDevice.setProductDescriptor(prodstr);

  // Init hardware Serial1 FIRST at MIDI baud rate
  Serial1.begin(31250);

  // Then init MIDI on top
  midiA.begin(MIDI_CHANNEL_OMNI);
  midiB.begin(MIDI_CHANNEL_OMNI);
  midiA.turnThruOff();
  midiB.turnThruOff();

  // Wait for USB mount
  while (!USBDevice.mounted()) delay(1);

  // Show idle color
  #ifdef RED_BOARD
    set_rgb(true, false, false);
    Serial.println("RED ready");
  #else
    set_rgb(false, false, true);
    Serial.println("BLUE ready");
  #endif
}

void loop() {

  // --- USB MIDI -> Serial MIDI ---
  if (midiA.read()) {
    midi::MidiType type = midiA.getType();
    byte data1   = midiA.getData1();
    byte data2   = midiA.getData2();
    byte channel = midiA.getChannel();
    midiB.send(type, data1, data2, channel);
    flash_color(true, true, false);  // yellow flash = USB->Serial
    Serial.println("USB->Serial");
  }

  // --- Serial MIDI -> USB MIDI ---
  if (midiB.read()) {
    midi::MidiType type = midiB.getType();
    byte data1   = midiB.getData1();
    byte data2   = midiB.getData2();
    byte channel = midiB.getChannel();
    midiA.send(type, data1, data2, channel);
    flash_color(false, true, false);  // green flash = Serial->USB
    Serial.println("Serial->USB");
  }

  led_check();
}
`
