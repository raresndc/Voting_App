import React, { useEffect, useState } from "react";
import { getAllDevices } from "../devices/api/DeviceApi.ts";
import Swal from "sweetalert2";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";

export default function VotingPage() {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    fetchCandidates();
  }, []);

  async function fetchCandidates() {
    try {
      const response = await getAllDevices();
      setCandidates(response.content);
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message });
    }
  }

  function handleVote(candidate) {
    Swal.fire({
      title: `Are you sure you want to vote for ${candidate.deviceName}?`,
      showDenyButton: true,
      confirmButtonText: "Yes, vote!",
      denyButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "Vote Cast!",
          text: `You have voted for ${candidate.deviceName}.`,
        });
      }
    });
  }

  return (
    <div className="mt-12 mb-8 flex flex-wrap gap-6 justify-center">
      {candidates.map((candidate) => (
        <Card key={candidate.id} className="w-80 p-4 shadow-lg">
          <CardBody>
            <Typography variant="h5" className="text-center font-bold">
              {candidate.deviceName}
            </Typography>
            <Typography className="text-center text-gray-600 mt-2">
              {candidate?.elDeviceType?.deviceTypeName} - {candidate?.elDeviceType?.deviceTypeDetails}
            </Typography>
            <Button
              // color="indigo"
              className="mt-4 w-full bg-gray-400"
              onClick={() => handleVote(candidate)}
            >
              Vote
            </Button>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
