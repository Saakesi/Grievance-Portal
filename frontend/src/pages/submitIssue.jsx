import React, { useState } from "react";
import axios from "axios";

const SubmitIssue = () => {
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    location: "",
  });
  const [images, setImages] = useState([]); // multiple images
  const [message, setMessage] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleImages = (e) => setImages([...e.target.files]); // multiple files
  console.log(handleImages);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.title || !form.category || !form.description || !form.location) {
      setMessage("❌ Please fill in all required fields.");
      return;
    }

    try {
      let imageUrls = [];

      if (images.length > 0) {
        for (const image of images) {
          const data = new FormData();
          data.append("file", image);
          data.append("upload_preset", "grievance_portal"); // your Cloudinary preset
          const res = await axios.post(
            "https://api.cloudinary.com/v1_1/dmdru6opb/image/upload",
            data
          );
          imageUrls.push(res.data.secure_url);
        }
      }

      const token = localStorage.getItem("token");
      console.log("Submitting form:", form, "images:", imageUrls); // debug

      await axios.post(
        "http://localhost:5000/api/issues",
        { ...form, image: imageUrls }, // send array of URLs
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("✅ Issue submitted successfully!");
      setForm({ title: "", category: "", description: "", location: "" });
      setImages([]);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Submission failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-80 p-4 border rounded">
        <h2 className="text-xl font-bold text-center">Submit Issue</h2>

        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="" disabled>Select Category</option>
          <option value="Infrastructure">Infrastructure</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Safety">Safety</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          type="file"
          onChange={handleImages}
          className="border p-1 rounded"
          multiple
        />

        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Submit</button>
        <p className="text-center">{message}</p>
      </form>
    </div>
  );
};

export default SubmitIssue;


/*
import React, { useState } from "react";
import axios from "axios";

const SubmitIssue = () => {
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    location: "", // added location
  });
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleImage = (e) => setImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = "";
      if (image) {
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "grievance_portal"); // set in Cloudinary
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/dmdru6opb/image/upload",
          data
        );
        imageUrl = res.data.secure_url;
      }

      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/issues",
        { ...form, image: imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("✅ Issue submitted successfully!");
      setForm({ title: "", category: "", description: "", location: "" });
      setImage(null);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Submission failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-80 p-4 border rounded">
        <h2 className="text-xl font-bold text-center">Submit Issue</h2>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

   
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="" disabled>Select Category</option>
          <option value="Infrastructure">Infrastructure</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Safety">Safety</option>
          <option value="Other">Other</option>
        </select>

  
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input type="file" onChange={handleImage} className="border p-1 rounded" />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Submit</button>
        <p className="text-center">{message}</p>
      </form>
    </div>
  );
};

export default SubmitIssue;
*/

