import { Pochaevsk } from "next/font/google";
import React from "react";

const AttachmentDetailPage = async ({ params }) => {
  const { id } = await params;
  const base_url = process.env.API_BASE_URL + "/attachments/" + id;

  if (id) {
    let res = await fetch(base_url);
    res = res.json();
  }

  return <div>
    
  </div>;
};

export default AttachmentDetailPage;
