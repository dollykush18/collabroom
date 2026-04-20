'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import HomeCard from './HomeCard';
import { useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useUser } from '@clerk/nextjs';
import Loader from './Loader';
import { useToast } from './ui/use-toast';
import { Input } from './ui/input';
import { Button } from './ui/button';

const CALL_TYPE = 'default';

const MeetingTypeList = () => {
  const router = useRouter();
  const client = useStreamVideoClient();
  const { user } = useUser();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [meetingLink, setMeetingLink] = useState('');
  const [joinLink, setJoinLink] = useState('');
  const [showJoinInput, setShowJoinInput] = useState(false);

  const createMeeting = async () => {
    if (!client || !user || loading) return;

    setLoading(true);

    try {
      const id = crypto.randomUUID();
      const call = client.call(CALL_TYPE, id);

      await call.getOrCreate({
        data: {
          starts_at: new Date().toISOString(),
          custom: {
            description: 'Instant Meeting',
          },
        },
      });

      const link = `${window.location.origin}/meeting/${id}`; 
      console.log("Generated Link:",link);

    
      setMeetingLink(link);

      toast({ title: 'Meeting Created' });

      setTimeout(() => setMeetingLink(''), 1000000000);
    } catch (error) {
      console.error(error);
      toast({ title: 'Failed to create meeting' });
    } finally {
      setLoading(false);
    }
  };

  const joinMeeting = () => {
    if (!joinLink.trim()) return;

    try {
      const url = new URL(joinLink);
      const id = url.pathname.split('/meeting/')[1];

      if (!id) throw new Error();

      router.push(`/meeting/${id}`);
      setShowJoinInput(false);
      setJoinLink('');
    } catch {
      toast({ title: 'Invalid meeting link' });
    }
  };

  if (!client || !user) return <Loader />;

  return (
    <section className="flex flex-col gap-6">

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <HomeCard
          img="/icons/add-meeting.svg"
          title="New Meeting"
          description="Start an instant meeting"
          handleClick={!loading ? createMeeting : undefined}
        />

        <HomeCard
          img="/icons/join-meeting.svg"
          title="Join Meeting"
          description="via invitation link"
          className="bg-indigo-900"
          handleClick={() => setShowJoinInput(true)}
        />

        <HomeCard
          img="/icons/schedule.svg"
          title="Schedule Meeting"
          description="Plan your meeting"
          className="bg-indigo-900"
          handleClick={!loading ? createMeeting : undefined}
        />

        <HomeCard
          img="/icons/recordings.svg"
          title="View Recordings"
          description="Meeting Recordings"
          className="bg-indigo-900"
          handleClick={() => router.push('/recordings')}
        />
      </div>

      {loading && (
        <p className="text-sm text-gray-300">Creating meeting...</p>
      )}

      {meetingLink && (
        <div className="flex flex-col gap-3 rounded bg-dark-2 p-4">
          <p className="text-sm">Share this meeting link:</p>
          <div className="flex gap-2">
            {/* <Input value={meetingLink} readOnly /> */}
            <Input
              value={meetingLink}
              readOnly
              className="bg-gray-900 text-white border-gray-700"
            />
            <Button
              onClick={() => {
                navigator.clipboard.writeText(meetingLink);
                toast({ title: 'Link copied!' });
              }}
            >
              Copy
            </Button>
            <Button onClick={() => router.push(meetingLink)}>
              Join Now
            </Button>
          </div>
        </div>
      )}

      {showJoinInput && (
        <div className="flex flex-col gap-3 rounded bg-dark-2 p-4">
          <p className="text-sm">Enter meeting link:</p>
          <div className="flex gap-2">
            <Input
              placeholder="Paste meeting link"
              value={joinLink}
              onChange={(e) => setJoinLink(e.target.value)}
              className="bg-gray-900 text-white border-gray-700 placeholder:text-gray-400"
            />
            <Button onClick={joinMeeting}>Join</Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default MeetingTypeList;