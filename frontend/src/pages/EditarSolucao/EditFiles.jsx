import React, { useState } from "react";
import axios from "axios";

export default function EditFiles({ authId, files, setFiles }) {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("jwt");

  const handleFileChange = async event => {
    const file = event.target.files[0];
    if (!file) return;

    if (files.length >= 4) {
      alert("Você pode enviar no máximo 4 arquivos!");
      return;
    }

    setLoading(true);

    try {
      const fileName = file.name.split(".")[0];
      const extention = file.name.split(".").pop();
      const contentType = file.type;

      const { data } = await axios.post(
        `http://localhost:8080/api/solutions/auth/${authId}/file-url`,
        {
          fileName,
          contentType,
          extention,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { uploadURL, fileURL } = data;

      await axios.put(uploadURL, file, {
        headers: {
          "Content-Type": file.type,
        },
        transformRequest: [
          (data, headers) => {
            delete headers.Authorization;
            return data;
          },
        ],
      });

      setFiles(prev => [
        ...prev,
        {
          name: fileName,
          extention: extention,
          url: fileURL,
        },
      ]);
    } catch (error) {
      console.error("Erro ao carregar arquivo:", error);
      alert("Erro ao carregar arquivo!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async fileURL => {
    setLoading(true);
    try {
      await axios.delete(
        `http://localhost:8080/api/solutions/auth/${authId}/file-url`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            fileURL,
          },
        }
      );
      setFiles(prev => prev.filter(f => f.url !== fileURL));
    } catch (error) {
      console.error("Erro ao deletar arquivo:", error);
      alert("Erro ao deletar arquivo!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-4 border rounded-lg shadow-md w-full max-w-md'>
      <h2 className='text-xl font-bold mb-4'>Upload de Arquivos</h2>

      <div className='flex items-center space-x-2'>
        <input
          type='file'
          id='fileInput'
          accept='.pdf,.doc,.png,.jpg,.jpeg,.mp4'
          onChange={handleFileChange}
          className='hidden'
        />
        <label
          htmlFor='fileInput'
          className='bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600'
        >
          Carregar arquivo
        </label>
      </div>

      {loading && <p className='mt-2 text-blue-500'>Carregando...</p>}

      <ul className='mt-4 space-y-2'>
        {files.map((file, idx) => (
          <li
            key={idx}
            className='flex justify-between items-center border p-2 rounded'
          >
            <a
              href={file.url}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:underline'
            >
              {file.name}.{file.extention}
            </a>

            <button
              className='bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600'
              onClick={() => handleDelete(file.url)}
              disabled={loading}
            >
              Deletar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
