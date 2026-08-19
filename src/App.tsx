import { useEffect, useRef, useState } from "react";
import "./App.css";

const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 1536;

const BACKGROUND = "/invitation-background.png";

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [name, setName] = useState("");
  const [message, setMessage] = useState(
    "You are cordially invited to join us"
  );
  const [date, setDate] = useState("30 August 2026");
  const [time, setTime] = useState("6:00 PM");
  const [venue, setVenue] = useState("Our Kovil");

  const [backgroundImage, setBackgroundImage] =
    useState<HTMLImageElement | null>(null);

  /*
   * Load background image once.
   */
  useEffect(() => {
    const image = new Image();

    image.onload = () => {
      setBackgroundImage(image);
    };

    image.src = BACKGROUND;
  }, []);

  /*
   * Draw invitation whenever data changes.
   */
  useEffect(() => {
    if (!backgroundImage) {
      return;
    }

    drawInvitation();
  }, [
    backgroundImage,
    name,
    message,
    date,
    time,
    venue,
  ]);

  const drawInvitation = () => {
    const canvas = canvasRef.current;

    if (!canvas || !backgroundImage) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    /*
     * Clear canvas.
     */
    context.clearRect(
      0,
      0,
      CANVAS_WIDTH,
      CANVAS_HEIGHT
    );

    /*
     * Draw background.
     */
    context.drawImage(
      backgroundImage,
      0,
      0,
      CANVAS_WIDTH,
      CANVAS_HEIGHT
    );

    /*
     * Text configuration.
     */
    context.textAlign = "center";
    context.textBaseline = "middle";

    /*
     * Invitee name.
     */
    if (name.trim()) {
      const nameFontSize = calculateNameFontSize(name);

      context.font = `600 ${nameFontSize}px "Noto Sans Sinhala", Arial, sans-serif`;

      context.fillStyle = "#17366d";

      /*
       * Small shadow makes the name readable.
       */
      context.shadowColor = "rgba(0, 0, 0, 0.12)";
      context.shadowBlur = 4;
      context.shadowOffsetX = 1;
      context.shadowOffsetY = 2;

      context.fillText(
        name.trim(),
        CANVAS_WIDTH / 2,
        650
      );

      /*
       * Reset shadow.
       */
      context.shadowColor = "transparent";
      context.shadowBlur = 0;
      context.shadowOffsetX = 0;
      context.shadowOffsetY = 0;
    }

    /*
     * Message.
     */
    context.font =
      '400 30px "Noto Sans Sinhala", Arial, sans-serif';

    context.fillStyle = "#4b4035";

    context.fillText(
      message,
      CANVAS_WIDTH / 2,
      730
    );

    /*
     * Date.
     */
    context.font =
      '600 30px "Noto Sans Sinhala", Arial, sans-serif';

    context.fillStyle = "#8a641d";

    context.fillText(
      `Date: ${date}`,
      CANVAS_WIDTH / 2,
      810
    );

    /*
     * Time.
     */
    context.fillText(
      `Time: ${time}`,
      CANVAS_WIDTH / 2,
      860
    );

    /*
     * Venue.
     */
    context.fillText(
      `Venue: ${venue}`,
      CANVAS_WIDTH / 2,
      910
    );
  };

  /*
   * Reduce font size for long names.
   */
  const calculateNameFontSize = (value: string) => {
    const length = value.trim().length;

    if (length <= 18) {
      return 52;
    }

    if (length <= 25) {
      return 44;
    }

    if (length <= 32) {
      return 38;
    }

    return 32;
  };

  /*
   * Download final invitation.
   */
  const downloadInvitation = () => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const link = document.createElement("a");

    const safeName =
      name.trim().replace(/[^a-zA-Z0-9\u0D80-\u0DFF]+/g, "_") ||
      "invitation";

    link.download = `${safeName}_invitation.png`;

    link.href = canvas.toDataURL(
      "image/png",
      1.0
    );

    link.click();
  };

  /*
   * Reset all fields.
   */
  const resetForm = () => {
    setName("");
    setMessage(
      "You are cordially invited to join us"
    );
    setDate("30 August 2026");
    setTime("6:00 PM");
    setVenue("Our Kovil");
  };

  return (
    <div className="app">
      <div className="container">

        <div className="header">
          <h1>Kovil Invitation</h1>
          <p>
            Create a personalized ceremony invitation
          </p>
        </div>

        <div className="workspace">

          {/* -------------------------------- */}
          {/* FORM */}
          {/* -------------------------------- */}

          <div className="panel form-panel">

            <h2>Invitation Details</h2>

            <div className="form-group">
              <label htmlFor="name">
                Invitee Name
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Enter person's name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">
                Message
              </label>

              <input
                id="message"
                type="text"
                value={message}
                onChange={(event) =>
                  setMessage(event.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="date">
                Date
              </label>

              <input
                id="date"
                type="text"
                value={date}
                onChange={(event) =>
                  setDate(event.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="time">
                Time
              </label>

              <input
                id="time"
                type="text"
                value={time}
                onChange={(event) =>
                  setTime(event.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="venue">
                Venue
              </label>

              <input
                id="venue"
                type="text"
                value={venue}
                onChange={(event) =>
                  setVenue(event.target.value)
                }
              />
            </div>

            <div className="button-group">

              <button
                className="download-button"
                onClick={downloadInvitation}
              >
                Download Invitation
              </button>

              <button
                className="reset-button"
                onClick={resetForm}
              >
                Reset
              </button>

            </div>

          </div>

          {/* -------------------------------- */}
          {/* PREVIEW */}
          {/* -------------------------------- */}

          <div className="panel preview-panel">

            <h2>Preview</h2>

            <div className="canvas-wrapper">
              <canvas ref={canvasRef} />
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default App;