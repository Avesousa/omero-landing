import { NextRequest, NextResponse } from "next/server";

interface ContactPayload {
  nombre: string;
  whatsapp: string;
  rubro: string;
}

function isValidPayload(data: unknown): data is ContactPayload {
  if (typeof data !== "object" || data === null) return false;
  const obj = data as Record<string, unknown>;
  return (
    typeof obj.nombre === "string" &&
    obj.nombre.trim().length > 0 &&
    typeof obj.whatsapp === "string" &&
    obj.whatsapp.trim().length > 0 &&
    typeof obj.rubro === "string" &&
    obj.rubro.trim().length > 0
  );
}

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Cuerpo de la solicitud inválido." },
      { status: 400 }
    );
  }

  if (!isValidPayload(body)) {
    return NextResponse.json(
      { success: false, error: "Faltan campos obligatorios: nombre, whatsapp, rubro." },
      { status: 422 }
    );
  }

  const { nombre, whatsapp, rubro } = body;

  const businessNumber =
    process.env.WHATSAPP_NUMBER || "5491100000000";

  const message = encodeURIComponent(
    `Hola! Soy ${nombre.trim()}, tengo un negocio de tipo "${rubro.trim()}" y quiero empezar mi prueba gratuita de 14 días en Omero. Mi WhatsApp es ${whatsapp.trim()}.`
  );

  const whatsappUrl = `https://wa.me/${businessNumber}?text=${message}`;

  return NextResponse.json({ success: true, whatsappUrl });
}
