import { Inngest } from "inngest";
import Donor from "../models/Donor.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "Life-Line" });

// -- Creation --
const syncDonorCreation = inngest.createFunction(
  { id: 'sync-donor-from-clerk' },
  { event: 'clerk/user.created' },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    const donorData = {
      _id: id,
      email: email_addresses?.[0]?.email_address || "",
      name: `${first_name || ""} ${last_name || ""}`.trim(),
      image: image_url || "",
    };
    await Donor.findByIdAndUpdate(id, donorData, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });
    return { success: true };
  }
);

// -- Update --
const syncDonorUpdation = inngest.createFunction(
  { id: 'update-donor-from-clerk' },
  { event: 'clerk/user.updated' },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    const donorData = {
      _id: id,
      email: email_addresses?.[0]?.email_address || "",
      name: `${first_name || ""} ${last_name || ""}`.trim(),
      image: image_url || "",
    };
    await Donor.findByIdAndUpdate(id, donorData, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });
    return { success: true };
  }
);

// -- Deletion --
const syncDonorDeletion = inngest.createFunction(
  { id: 'delete-donor-with-clerk' },
  { event: 'clerk/user.deleted' },
  async ({ event }) => {
    const { id } = event.data;
    await Donor.findByIdAndDelete(id);
    return { success: true };
  }
);

export const functions = [
  syncDonorCreation,
  syncDonorUpdation,
  syncDonorDeletion,
];