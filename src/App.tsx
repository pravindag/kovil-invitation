import { useEffect, useRef, useState } from "react";
import "./App.css";

const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 1536;

const BACKGROUND_IMAGE = "/invitation-background.png";

const DEFAULT_MAIN_MESSAGE =
  "හි පිහිටා ඇති අභිනවයෙන් නිම කරන ලද කුටියේ කතරගම දේවතාවන්ගේ දේව පිළිමය හා පත්තිනි දේවතාවුන්ගේ දේව පිළිමය තැන්පත් කිරීම හා කතරගම දේව හෝම පූජා කිරීමේ පුණ්‍යමහෝත්සවය වෙනුවෙන් පැවැත්වෙන විශේෂ පිංකම් මාලාව සඳහා";

const DEFAULT_FINAL_MESSAGE =
  "මෙම උතුම් පුණ්‍ය කර්මයට සහභාගී වී දේව ආශිර්වාදය ලබාගන්නා මෙන් ඔබ සැම ගෞරවයෙන් හා භක්තියෙන් යුතුව කැඳවා සිටිමු.";

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [background, setBackground] =
    useState<HTMLImageElement | null>(null);

  const [topGreeting, setTopGreeting] =
    useState("දේව ආශිර්වාදයයි!");

  const [invitationTitle, setInvitationTitle] =
    useState("ආරාධනයයි");

  const [inviteeName, setInviteeName] =
    useState("");

  const [inviteeType, setInviteeType] =
    useState<"single" | "group">("single");

  const [venueName, setVenueName] =
    useState(
      "8/ඒ/10, පහලහේන පාර, පැතුම් උයන, කඹුරුගොඩ,"
    );

  const [location, setLocation] =
    useState("බණ්ඩාරගම");

  const [mainMessage, setMainMessage] =
    useState(DEFAULT_MAIN_MESSAGE);

  const [scheduleTitle, setScheduleTitle] =
    useState("පිංකම් මාලාවේ කාලසටහන");

  const [eventDate, setEventDate] =
    useState("2026 ක් වු බිනර මස 15 වන");

  const [eventDay, setEventDay] =
    useState("අඟහරුවාදා");

  const [auspiciousTime, setAuspiciousTime] =
    useState("[වේලාව]");

  const [poojaTime, setPoojaTime] =
    useState("[වේලාව]");

  const [finalMessage, setFinalMessage] =
    useState(DEFAULT_FINAL_MESSAGE);

  /*
  |--------------------------------------------------------------------------
  | LOAD BACKGROUND
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const image = new Image();

    image.onload = () => {
      setBackground(image);
    };

    image.onerror = () => {
      console.error(
        "Unable to load invitation-background.png"
      );
    };

    image.src = BACKGROUND_IMAGE;
  }, []);

  /*
  |--------------------------------------------------------------------------
  | REDRAW
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!background) {
      return;
    }

    drawInvitation();
  }, [
    background,
    topGreeting,
    invitationTitle,
    inviteeName,
    inviteeType,
    venueName,
    location,
    mainMessage,
    scheduleTitle,
    eventDate,
    eventDay,
    auspiciousTime,
    poojaTime,
    finalMessage,
  ]);

  /*
  |--------------------------------------------------------------------------
  | DRAW INVITATION
  |--------------------------------------------------------------------------
  */

  const drawInvitation = () => {
    const canvas = canvasRef.current;

    if (!canvas || !background) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | IMPORTANT
    |
    | Keep the real canvas at 1024 x 1536.
    | CSS will resize it for mobile.
    |--------------------------------------------------------------------------
    */

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    context.clearRect(
      0,
      0,
      CANVAS_WIDTH,
      CANVAS_HEIGHT
    );

    /*
    |--------------------------------------------------------------------------
    | BACKGROUND
    |--------------------------------------------------------------------------
    */

    context.drawImage(
      background,
      0,
      0,
      CANVAS_WIDTH,
      CANVAS_HEIGHT
    );

    context.textBaseline = "middle";

    /*
    |--------------------------------------------------------------------------
    | GREETING
    |--------------------------------------------------------------------------
    */

    drawCenteredText(
      context,
      topGreeting,
      512,
      550,
      27,
      "#76261f",
      850,
      700
    );

    /*
    |--------------------------------------------------------------------------
    | TITLE
    |--------------------------------------------------------------------------
    */

    drawCenteredText(
      context,
      invitationTitle,
      512,
      620,
      55,
      "#76261f",
      700,
      700
    );

    /*
    |--------------------------------------------------------------------------
    | VENUE
    |--------------------------------------------------------------------------
    */

    drawCenteredText(
      context,
      venueName,
      512,
      700,
      25,
      "#4e2b22",
      850,
      500
    );

    /*
    |--------------------------------------------------------------------------
    | LOCATION
    |--------------------------------------------------------------------------
    */

    drawCenteredText(
      context,
      location,
      512,
      745,
      25,
      "#4e2b22",
      700,
      500
    );

    /*
    |--------------------------------------------------------------------------
    | MAIN MESSAGE
    |--------------------------------------------------------------------------
    */

    drawWrappedText(
      context,
      mainMessage,
      512,
      800,
      790,
      24,
      36,
      "#4e2b22",
      4
    );

    /*
    |--------------------------------------------------------------------------
    | INVITEE NAME
    |--------------------------------------------------------------------------
    */

    if (inviteeName.trim()) {
      drawInviteeName(
        context,
        inviteeName.trim()
      );
    }

    drawWrappedText(
      context,
      "..................................................................................",
      512,
      955,
      790,
      24,
      36,
      "#4e2b22",
      2
    );

    /*
    |--------------------------------------------------------------------------
    | DYNAMIC AUDIENCE
    |--------------------------------------------------------------------------
    */

    const invitationAudience =
      inviteeType === "single"
        ? "ඔබට"
        : "ඔබ සැමට";

    drawWrappedText(
      context,
      `${invitationAudience} කාරුණිකව ආරාධනා කර සිටිමු.`,
      512,
      985,
      790,
      24,
      36,
      "#4e2b22",
      2
    );

    /*
    |--------------------------------------------------------------------------
    | SCHEDULE
    |--------------------------------------------------------------------------
    */

    drawScheduleBanner(
      context,
      scheduleTitle
    );

    /*
    |--------------------------------------------------------------------------
    | DATE
    |--------------------------------------------------------------------------
    */

    drawScheduleLine(
      context,
      `දිනය: ${eventDate} (${eventDay})`,
      1105
    );

    /*
    |--------------------------------------------------------------------------
    | AUSPICIOUS TIME
    |--------------------------------------------------------------------------
    */

    drawScheduleLine(
      context,
      `සුභ මොහොත (ප්‍රතිමා ප්‍රතිෂ්ඨාපනය): පෙරවරු ${auspiciousTime} ට`,
      1155
    );

    /*
    |--------------------------------------------------------------------------
    | POOJA
    |--------------------------------------------------------------------------
    */

    drawScheduleLine(
      context,
      `විශේෂ පූජාව සහ දානය: පස්වරු ${poojaTime} ට`,
      1205
    );

    /*
    |--------------------------------------------------------------------------
    | FINAL MESSAGE
    |--------------------------------------------------------------------------
    */

    drawWrappedText(
      context,
      finalMessage,
      512,
      1280,
      760,
      24,
      36,
      "#4e2b22",
      4
    );
  };

  /*
  |--------------------------------------------------------------------------
  | INVITEE NAME
  |--------------------------------------------------------------------------
  */

  const drawInviteeName = (
    context: CanvasRenderingContext2D,
    value: string
  ) => {
    let fontSize = 44;

    if (value.length > 18) {
      fontSize = 44;
    }

    if (value.length > 25) {
      fontSize = 40;
    }

    if (value.length > 35) {
      fontSize = 35;
    }

    if (value.length > 45) {
      fontSize = 31;
    }

    context.textAlign = "center";

    context.font =
      `700 ${fontSize}px "Noto Sans Sinhala", sans-serif`;

    context.fillStyle = "#76261f";

    context.shadowColor =
      "rgba(255,255,255,0.85)";

    context.shadowBlur = 5;

    context.fillText(
      value,
      512,
      945
    );

    context.shadowColor = "transparent";
    context.shadowBlur = 0;
  };

  /*
  |--------------------------------------------------------------------------
  | CENTERED TEXT
  |--------------------------------------------------------------------------
  */

  const drawCenteredText = (
    context: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    fontSize: number,
    color: string,
    maxWidth: number,
    fontWeight: number
  ) => {
    let currentFontSize = fontSize;

    context.textAlign = "center";

    context.font =
      `${fontWeight} ${currentFontSize}px "Noto Sans Sinhala", sans-serif`;

    while (
      context.measureText(text).width >
        maxWidth &&
      currentFontSize > 15
    ) {
      currentFontSize--;

      context.font =
        `${fontWeight} ${currentFontSize}px "Noto Sans Sinhala", sans-serif`;
    }

    context.fillStyle = color;

    context.fillText(
      text,
      x,
      y
    );
  };

  /*
  |--------------------------------------------------------------------------
  | WRAPPED TEXT
  |--------------------------------------------------------------------------
  */

  const drawWrappedText = (
    context: CanvasRenderingContext2D,
    text: string,
    centerX: number,
    startY: number,
    maxWidth: number,
    fontSize: number,
    lineHeight: number,
    color: string,
    maxLines: number
  ) => {
    context.textAlign = "center";

    context.font =
      `500 ${fontSize}px "Noto Sans Sinhala", sans-serif`;

    context.fillStyle = color;

    const words = text.split(" ");

    const lines: string[] = [];

    let currentLine = "";

    for (const word of words) {
      const testLine =
        currentLine.length === 0
          ? word
          : `${currentLine} ${word}`;

      const width =
        context.measureText(testLine).width;

      if (
        width > maxWidth &&
        currentLine.length > 0
      ) {
        lines.push(currentLine);

        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine.length > 0) {
      lines.push(currentLine);
    }

    /*
    |--------------------------------------------------------------------------
    | If text is too long, reduce font size
    |--------------------------------------------------------------------------
    */

    let finalFontSize = fontSize;

    if (lines.length > maxLines) {
      finalFontSize = fontSize - 2;

      context.font =
        `500 ${finalFontSize}px "Noto Sans Sinhala", sans-serif`;
    }

    /*
    |--------------------------------------------------------------------------
    | Rebuild lines with smaller font
    |--------------------------------------------------------------------------
    */

    const finalLines: string[] = [];

    let line = "";

    for (const word of words) {
      const testLine =
        line.length === 0
          ? word
          : `${line} ${word}`;

      if (
        context.measureText(testLine).width >
          maxWidth &&
        line.length > 0
      ) {
        finalLines.push(line);
        line = word;
      } else {
        line = testLine;
      }
    }

    if (line.length > 0) {
      finalLines.push(line);
    }

    const visibleLines =
      finalLines.slice(0, maxLines);

    visibleLines.forEach(
      (currentText, index) => {
        context.fillText(
          currentText,
          centerX,
          startY +
            index * lineHeight
        );
      }
    );
  };

  /*
  |--------------------------------------------------------------------------
  | SCHEDULE BANNER
  |--------------------------------------------------------------------------
  */

  const drawScheduleBanner = (
    context: CanvasRenderingContext2D,
    title: string
  ) => {
    const x = 175;
    const y = 1010;
    const width = 674;
    const height = 68;

    context.beginPath();

    context.roundRect(
      x,
      y,
      width,
      height,
      32
    );

    context.fillStyle =
      "#a51e28";

    context.fill();

    context.lineWidth = 4;

    context.strokeStyle =
      "#c8932b";

    context.stroke();

    let fontSize = 32;

    context.font =
      `700 ${fontSize}px "Noto Sans Sinhala", sans-serif`;

    while (
      context.measureText(title).width >
        width - 70 &&
      fontSize > 20
    ) {
      fontSize--;

      context.font =
        `700 ${fontSize}px "Noto Sans Sinhala", sans-serif`;
    }

    context.fillStyle = "#ffffff";

    context.textAlign = "center";

    context.fillText(
      title,
      512,
      y + height / 2
    );
  };

  /*
  |--------------------------------------------------------------------------
  | SCHEDULE LINE
  |--------------------------------------------------------------------------
  */

  const drawScheduleLine = (
    context: CanvasRenderingContext2D,
    text: string,
    y: number
  ) => {
    /*
    |--------------------------------------------------------------------------
    | DIAMOND
    |--------------------------------------------------------------------------
    */

    context.save();

    context.translate(
      160,
      y
    );

    context.rotate(
      Math.PI / 4
    );

    context.fillStyle =
      "#c79227";

    context.fillRect(
      -6,
      -6,
      12,
      12
    );

    context.restore();

    /*
    |--------------------------------------------------------------------------
    | TEXT
    |--------------------------------------------------------------------------
    */

    context.textAlign = "left";

    let fontSize = 23;

    context.font =
      `600 ${fontSize}px "Noto Sans Sinhala", sans-serif`;

    while (
      context.measureText(text).width >
        720 &&
      fontSize > 16
    ) {
      fontSize--;

      context.font =
        `600 ${fontSize}px "Noto Sans Sinhala", sans-serif`;
    }

    context.fillStyle =
      "#4e2b22";

    context.fillText(
      text,
      190,
      y
    );

    context.textAlign = "center";
  };

  /*
  |--------------------------------------------------------------------------
  | DOWNLOAD
  |--------------------------------------------------------------------------
  */

  const downloadInvitation = () => {
    const canvas =
      canvasRef.current;

    if (!canvas) {
      return;
    }

    const cleanName =
      inviteeName.trim()
        ? inviteeName
            .trim()
            .replace(
              /[^a-zA-Z0-9\u0D80-\u0DFF]+/g,
              "_"
            )
        : "kovil_invitation";

    const link =
      document.createElement("a");

    link.download =
      `${cleanName}_invitation.png`;

    link.href =
      canvas.toDataURL(
        "image/png",
        1.0
      );

    link.click();
  };

  /*
  |--------------------------------------------------------------------------
  | RESET
  |--------------------------------------------------------------------------
  */

  const resetForm = () => {
    setTopGreeting(
      "දේව ආශිර්වාදයයි!"
    );

    setInvitationTitle(
      "ආරාධනයයි"
    );

    setInviteeName("");

    setInviteeType("single");

    setVenueName(
      "8/ඒ/10, පහලහේන පාර, පැතුම් උයන, කඹුරුගොඩ,"
    );

    setLocation("බණ්ඩාරගම");

    setMainMessage(
      DEFAULT_MAIN_MESSAGE
    );

    setScheduleTitle(
      "පිංකම් මාලාවේ කාලසටහන"
    );

    setEventDate(
      "2026 ක් වු බිනර මස 15 වන"
    );

    setEventDay(
      "අඟහරුවාදා"
    );

    setAuspiciousTime(
      "[වේලාව]"
    );

    setPoojaTime(
      "[වේලාව]"
    );

    setFinalMessage(
      DEFAULT_FINAL_MESSAGE
    );
  };

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <div className="app">

      <header className="app-header">
        <h1>
          ආරාධනා පත්‍ර නිර්මාණය
        </h1>

        <p>
          Kovil Ceremony Invitation Generator
        </p>
      </header>

      <main className="workspace">

        {/* =================================================
            FORM
        ================================================= */}

        <section className="control-panel">

          <div className="panel-header">
            <div>
              <h2>
                ආරාධනා විස්තර
              </h2>

              <span>
                Invitation Details
              </span>
            </div>
          </div>

          {/* INVITEE */}

          <div className="form-group highlight">

            <label>
              ආරාධිතයාගේ නම
            </label>

            <span className="field-hint">
              Invitee Name
            </span>

            <input
              type="text"
              value={inviteeName}
              onChange={(event) =>
                setInviteeName(
                  event.target.value
                )
              }
              placeholder="උදා: ප්‍රවීන් මහතා"
            />

          </div>

          {/* AUDIENCE */}

          <div className="form-group highlight">

            <label>
              ආරාධනා කරන්නේ
            </label>

            <span className="field-hint">
              Invitation Audience
            </span>

            <select
              value={inviteeType}
              onChange={(event) =>
                setInviteeType(
                  event.target.value as
                    | "single"
                    | "group"
                )
              }
            >
              <option value="single">
                එක් පුද්ගලයෙකුට - ඔබට
              </option>

              <option value="group">
                කිහිප දෙනෙකුට - ඔබ සැමට
              </option>
            </select>

          </div>

          {/* GREETING */}

          <div className="form-group">

            <label>
              ආරම්භක ආශිර්වාදය
            </label>

            <span className="field-hint">
              Greeting
            </span>

            <input
              type="text"
              value={topGreeting}
              onChange={(event) =>
                setTopGreeting(
                  event.target.value
                )
              }
            />

          </div>

          {/* TITLE */}

          <div className="form-group">

            <label>
              ආරාධනා මාතෘකාව
            </label>

            <span className="field-hint">
              Invitation Title
            </span>

            <input
              type="text"
              value={invitationTitle}
              onChange={(event) =>
                setInvitationTitle(
                  event.target.value
                )
              }
            />

          </div>

          {/* VENUE */}

          <div className="form-group">

            <label>
              ස්ථානයේ නම සහ ලිපිනය
            </label>

            <span className="field-hint">
              Venue / Temple / Kovil
            </span>

            <input
              type="text"
              value={venueName}
              onChange={(event) =>
                setVenueName(
                  event.target.value
                )
              }
            />

          </div>

          {/* LOCATION */}

          <div className="form-group">

            <label>
              ගම / නගරය
            </label>

            <span className="field-hint">
              Village / City
            </span>

            <input
              type="text"
              value={location}
              onChange={(event) =>
                setLocation(
                  event.target.value
                )
              }
            />

          </div>

          {/* MAIN MESSAGE */}

          <div className="form-group">

            <label>
              ප්‍රධාන ආරාධනා පණිවිඩය
            </label>

            <span className="field-hint">
              Main Invitation Message
            </span>

            <textarea
              value={mainMessage}
              onChange={(event) =>
                setMainMessage(
                  event.target.value
                )
              }
              rows={7}
            />

          </div>

          {/* SCHEDULE TITLE */}

          <div className="form-group">

            <label>
              කාලසටහන් මාතෘකාව
            </label>

            <span className="field-hint">
              Schedule Title
            </span>

            <input
              type="text"
              value={scheduleTitle}
              onChange={(event) =>
                setScheduleTitle(
                  event.target.value
                )
              }
            />

          </div>

          {/* DATE */}

          <div className="form-group">

            <label>
              දිනය
            </label>

            <span className="field-hint">
              Date
            </span>

            <input
              type="text"
              value={eventDate}
              onChange={(event) =>
                setEventDate(
                  event.target.value
                )
              }
            />

          </div>

          {/* DAY */}

          <div className="form-group">

            <label>
              දිනයේ නම
            </label>

            <span className="field-hint">
              Day
            </span>

            <input
              type="text"
              value={eventDay}
              onChange={(event) =>
                setEventDay(
                  event.target.value
                )
              }
            />

          </div>

          {/* AUSPICIOUS TIME */}

          <div className="form-group">

            <label>
              සුභ මොහොත
            </label>

            <span className="field-hint">
              Auspicious Time
            </span>

            <input
              type="text"
              value={auspiciousTime}
              onChange={(event) =>
                setAuspiciousTime(
                  event.target.value
                )
              }
              placeholder="උදා: 9.30"
            />

          </div>

          {/* POOJA */}

          <div className="form-group">

            <label>
              විශේෂ පූජාව සහ දානය
            </label>

            <span className="field-hint">
              Special Pooja / Danaya
            </span>

            <input
              type="text"
              value={poojaTime}
              onChange={(event) =>
                setPoojaTime(
                  event.target.value
                )
              }
              placeholder="උදා: 5.00"
            />

          </div>

          {/* FINAL MESSAGE */}

          <div className="form-group">

            <label>
              අවසාන පණිවිඩය
            </label>

            <span className="field-hint">
              Final Message
            </span>

            <textarea
              value={finalMessage}
              onChange={(event) =>
                setFinalMessage(
                  event.target.value
                )
              }
              rows={5}
            />

          </div>

          {/* BUTTONS */}

          <div className="button-group">

            <button
              className="download-button"
              onClick={
                downloadInvitation
              }
              disabled={!background}
            >
              <span>⬇</span>
              Download PNG
            </button>

            <button
              className="reset-button"
              onClick={resetForm}
            >
              Reset
            </button>

          </div>

        </section>

        {/* =================================================
            PREVIEW
        ================================================= */}

        <section className="preview-panel">

          <div className="panel-header">
            <div>
              <h2>
                Preview
              </h2>

              <span>
                Live Invitation Preview
              </span>
            </div>
          </div>

          <div className="preview-container">

            {!background && (
              <div className="loading">
                Loading invitation...
              </div>
            )}

            <canvas
              ref={canvasRef}
              className="invitation-canvas"
            />

          </div>

        </section>

      </main>

    </div>
  );
}

export default App;