import { useEffect, useState } from "react";
import Header from "../components/Header";

// ---- Helper: merge consecutive same‑speaker entries ----
function mergeTranscript(entries) {
  const merged = [];

  let currentSpeaker = null;
  let texts = [];
  let timestamps = [];

  for (const entry of entries) {
    if (currentSpeaker === null) {
      currentSpeaker = entry.speaker;
      texts = [entry.text];
      timestamps = [entry.timestamp];
    } else if (entry.speaker === currentSpeaker) {
      texts.push(entry.text);
      timestamps.push(entry.timestamp);
    } else {
      merged.push({
        speaker: currentSpeaker,
        text: texts.join(" "),
        timestampStart: timestamps[0],
        timestampEnd: timestamps[timestamps.length - 1],
      });
      currentSpeaker = entry.speaker;
      texts = [entry.text];
      timestamps = [entry.timestamp];
    }
  }

  if (currentSpeaker !== null) {
    merged.push({
      speaker: currentSpeaker,
      text: texts.join(" "),
      timestampStart: timestamps[0],
      timestampEnd: timestamps[timestamps.length - 1],
    });
  }

  return merged;
}

// ---- All 5 interviews ----
const interviews = [
  // -------- INTERVIEW 1 (your full original transcript) --------
  {
    id: 1,
    title: "Interviewee: B",
    meta: "Founder and director of a biodiversity and sustainability institute",
    date: "Recorded in Bethlehem, 2026",
    transcript: [
      { speaker: "A", text: "Thank you very much for taking the time to meet with me in person.", timestamp: "00:00:00,000 → 00:00:05,000" },
      { speaker: "A", text: "My research looks at how ecological knowledge is produced under conditions of occupation, especially through practices of sensing and monitoring and care.", timestamp: "00:00:05,000 → 00:00:10,000" },
      { speaker: "A", text: "I'm interested in how scientists, researchers, and communities continue to observe and protect life when access to land, technology, and mobility is restricted.", timestamp: "00:00:10,000 → 00:00:14,000" },
      { speaker: "A", text: "Your work has been extremely important for me in understanding how biodiversity research in Palestine is not only scientific, but also ethical and political in practice.", timestamp: "00:00:14,000 → 00:00:18,000" },
      { speaker: "A", text: "I was especially drawn to the way you combine rigorous research of education, community involvement, and long-term commitment to the land.", timestamp: "00:00:18,000 → 00:00:22,000" },
      { speaker: "A", text: "And I'm grateful for the chance to learn from your experience, and I'd like to begin by inviting you to introduce yourself in your own words.", timestamp: "00:00:22,000 → 00:00:26,000" },
      { speaker: "B", text: "Okay, so I'm as you can see, I'm a professor, so to speak.", timestamp: "00:00:26,000 → 00:00:30,000" },
      { speaker: "B", text: "I don't teach anymore, and I'm retired in the sense that I don't get a salary from anybody.", timestamp: "00:00:30,000 → 00:00:35,000" },
      { speaker: "B", text: "I'm a full-time volunteer here, I'm founder and director of this institute called the Palestine Institute for Biodiversity and Sustainability at Bethlehem University, which we started in 2014 with a vision for sustainable human and natural communities.", timestamp: "00:00:35,000 → 00:00:38,000" },
      { speaker: "B", text: "So I've been in the field of biology and biodiversity for over four decades, and now I am just full-time dedicated volunteerism overseeing a transition in this institute with the new museum and so on.", timestamp: "00:00:38,000 → 00:00:41,000" },
      { speaker: "A", text: "Can you describe what your current role and area of focus is?", timestamp: "00:00:41,000 → 00:00:45,000" },
      { speaker: "B", text: "My role here is basically to work on several areas of the institute that I am knowledgeable about.", timestamp: "00:00:45,000 → 00:00:53,000" },
      { speaker: "B", text: "The institute focuses on four areas basically, research, education or learning, community service and conservation efforts. Those are the four areas we focus on.", timestamp: "00:00:53,000 → 00:01:00,000" },
      { speaker: "B", text: "Let's start with research. On research areas, I oversee the research projects that happen here.", timestamp: "00:01:00,000 → 00:01:07,000" },
      { speaker: "B", text: "Last year we published 22 articles, research papers. Hopefully this year we will do even more.", timestamp: "00:01:07,000 → 00:01:14,000" },
      { speaker: "B", text: "Most of our research is applied research related to basically how we conserve our environment, how we get this vision realized as a set of sustainable human and natural communities.", timestamp: "00:01:14,000 → 00:01:23,000" },
      { speaker: "B", text: "In terms of education, like today there will be a group of children coming.", timestamp: "00:01:23,000 → 00:01:29,000" },
      { speaker: "B", text: "I don't oversee our education projects. There are other people like Sarah and Amal and Zaina that are working on these things, but I do help in the overall structure of the educational component.", timestamp: "00:01:29,000 → 00:01:41,000" },
      { speaker: "B", text: "Certainly one of the educational components is using a museum and botanical garden as modules for education, how we can educate people via these systems.", timestamp: "00:01:41,000 → 00:01:45,000" },
      { speaker: "B", text: "So in that sense I look at how we are going to exhibit things, what are the messages that we are trying to exhibit at the Natural History Museum, at the ethnography section and so on. That's in terms of education.", timestamp: "00:01:45,000 → 00:01:50,000" },
      { speaker: "B", text: "In terms of the community service, we have some projects like with National Geographic Society and Darwin Initiative.", timestamp: "00:01:50,000 → 00:02:00,000" },
      { speaker: "B", text: "We had the project funded by the European Union to allow us to spend some money working with the communities, empowering them, community led efforts basically to help themselves.", timestamp: "00:02:00,000 → 00:02:08,000" },
      { speaker: "B", text: "So they are always involved in the planning of these projects and they are involved in how these projects are run.", timestamp: "00:02:08,000 → 00:02:16,000" },
      { speaker: "B", text: "This helps them and their communities.", timestamp: "00:02:16,000 → 00:02:23,000" },
      { speaker: "B", text: "And in conservation efforts, again we work with the community also for nature conservation and we work to study, research and educate about particular vulnerable areas, particular protected areas.", timestamp: "00:02:23,000 → 00:02:32,000" },
      { speaker: "B", text: "We were the ones who designated the protected area network for the state of Palestine, the limiting where these national parks are, how to protect them, how to engage the community in protecting them and what to do, what species are most critical.", timestamp: "00:02:32,000 → 00:02:40,000" },
      { speaker: "B", text: "So these are the various areas that I try to guide and oversee in some areas, run some projects.", timestamp: "00:02:40,000 → 00:02:52,000" },
      { speaker: "B", text: "I do have also some aspects of other ancillary functions like public relations and communication to the global community.", timestamp: "00:02:52,000 → 00:02:57,000" },
      { speaker: "B", text: "I give a few talks every week, five or six talks. I do interviews like this one.", timestamp: "00:02:57,000 → 00:03:05,000" },
      { speaker: "B", text: "This is public relations. This is an area that we need to do more of, obviously, to send a message out.", timestamp: "00:03:05,000 → 00:03:18,000" },
      { speaker: "B", text: "And what's the message? The message is that we need human conservation, we need natural conservation.", timestamp: "00:03:18,000 → 00:03:28,000" },
      { speaker: "A", text: "So looking back, what originally drew you to biology and biodiversity research?", timestamp: "00:03:28,000 → 00:03:33,000" },
      { speaker: "B", text: "I'm sorry, what originally?", timestamp: "00:03:33,000 → 00:03:43,000" },
      { speaker: "A", text: "Looking back from your time in this work you're doing now, what drew you to biology and biodiversity research? What drove you to do this and what led you to commit to this work in Palestine specifically?", timestamp: "00:03:43,000 → 00:03:52,000" },
      { speaker: "B", text: "Well, I have been in love with nature since my childhood.", timestamp: "00:03:52,000 → 00:04:02,000" },
      { speaker: "B", text: "I used to go to the valleys around Bethlehem with my mother, my uncle.", timestamp: "00:04:02,000 → 00:04:10,000" },
      { speaker: "B", text: "We collect wild plants, herbal medicinal plants, study nature with my uncle who was the first Palestinian zoologist.", timestamp: "00:04:10,000 → 00:04:17,000" },
      { speaker: "B", text: "So that's how I learned to love nature.", timestamp: "00:04:17,000 → 00:04:27,000" },
      { speaker: "B", text: "But in terms of biology and biodiversity and so forth, you have to also realize that in our case, which is a fairly unique case, since we are basically the last colonial apartheid regime on earth that's still functioning, we have a system of oppression and ethnic cleansing and attack on our environment from the colonizers, attack on our people from the colonizer.", timestamp: "00:04:27,000 → 00:04:31,000" },
      { speaker: "B", text: "As indigenous people, indigenous people are always tied to the land.", timestamp: "00:04:31,000 → 00:04:38,000" },
      { speaker: "B", text: "And what the colonizers want to do is obliterate, destroy the indigenous people and destroy our connection with the land.", timestamp: "00:04:38,000 → 00:04:50,000" },
      { speaker: "B", text: "So what is our job? What drives us? If you want that question that you asked, what drives us is that passion to retain our connectivity to our land, our connectivity to our people and our culture.", timestamp: "00:04:50,000 → 00:04:57,000" },
      { speaker: "B", text: "Usually colonizers, wherever they are, British colonizers, for example, in Australia or North America and what became the United States, are interested in destroying both human diversity and biological diversity, human diversity and biological diversity, and creating monolithic culture, you know, English speaking, for example, whatever.", timestamp: "00:04:57,000 → 00:05:07,000" },
      { speaker: "B", text: "The indigenous people love what they have, which is biological diversity for nature and human diversity, different languages, different tribes of Native Americans, for example.", timestamp: "00:05:07,000 → 00:05:11,000" },
      { speaker: "B", text: "In our case also, we had the pluralistic society composed of basically humans of various religions.", timestamp: "00:05:11,000 → 00:05:21,000" },
      { speaker: "B", text: "We were multireligious, multiethnic, multicultural, even multilingual.", timestamp: "00:05:21,000 → 00:05:34,000" },
      { speaker: "B", text: "Before 1948, there were 44 languages spoken in Palestine.", timestamp: "00:05:34,000 → 00:05:41,000" },
      { speaker: "B", text: "The idea of Zionism and colonialism is to remove this pluralistic society and create a monolithic society.", timestamp: "00:05:41,000 → 00:05:51,000" },
      { speaker: "B", text: "In this particular case, in our region, it is to make a Jewish state with Jewish culture, Jewish religion, Jewish language, Hebrew.", timestamp: "00:05:51,000 → 00:06:02,000" },
      { speaker: "B", text: "And that's it. No other, no space for other people.", timestamp: "00:06:02,000 → 00:06:06,000" },
      { speaker: "B", text: "So this struggle between the indigenous people and what they want and the colonizers and what they want, we are at that, at that nexus of the struggle.", timestamp: "00:06:06,000 → 00:06:08,000" },
      { speaker: "B", text: "We as an institute work to, to enhance biological diversity and enhance cultural and religious and political and human diversity, as it was before the colonization accelerated after the foundation of the State of Israel in 1948.", timestamp: "00:06:08,000 → 00:06:16,000" },
      { speaker: "A", text: "So much your work relies on field observation, citizen science and community participation.", timestamp: "00:06:56,000 → 00:07:08,000" },
      { speaker: "A", text: "How do you think about sensing and monitoring nature and when advanced technologies are unavailable or controlled elsewhere?", timestamp: "00:07:08,000 → 00:07:16,000" },
      { speaker: "B", text: "That's a very good question and something we have to actually it's on our priorities for the coming year or two.", timestamp: "00:07:16,000 → 00:07:19,000" },
      { speaker: "B", text: "Now the availability of artificial intelligence and, you know, these modern tools that are available technologically, they are being used for oppression, but they can be used for good, like everything else, like computers, like Internet.", timestamp: "00:07:19,000 → 00:07:24,000" },
      { speaker: "B", text: "It can be used for bad purposes. It can be used for good purposes. It can be used to defend the indigenous people, for example.", timestamp: "00:07:24,000 → 00:07:34,000" },
      { speaker: "B", text: "So I think that you excuse me, the use of technology is a critical component of our work, even when they try to restrict it.", timestamp: "00:07:34,000 → 00:07:41,000" },
      { speaker: "B", text: "For example, Israel has allowed us 3G only in 2018 or something long.", timestamp: "00:07:41,000 → 00:07:51,000" },
      { speaker: "B", text: "We were the last country to get 3G and we're still at 3G.", timestamp: "00:07:51,000 → 00:08:04,000" },
      { speaker: "B", text: "This week they said they are going to give us fourth generation Internet access and people have been on fifth generation long time ago.", timestamp: "00:08:04,000 → 00:08:14,000" },
      { speaker: "B", text: "So, you know, the attempts to restrict us, to control us, to manage us electronically, facial recognition is very famous here.", timestamp: "00:08:14,000 → 00:08:20,000" },
      { speaker: "B", text: "Every move we make, even this interview is being recorded, sent to the Israeli Mossad because all the phones we use, all our phones are basically bugged.", timestamp: "00:08:20,000 → 00:08:30,000" },
      { speaker: "B", text: "There's actually there's a friend of mine, Basil Khoury, who's going to come.", timestamp: "00:09:25,000 → 00:09:38,000" },
      { speaker: "B", text: "Amal, today I wanted him to talk to you and to us about Internet security and things like that.", timestamp: "00:09:38,000 → 00:09:54,000" },
      { speaker: "B", text: "How we can guard against some of the infiltrations and attempt to destroy our work.", timestamp: "00:09:54,000 → 00:10:05,000" },
      { speaker: "B", text: "And they do try to impact us.", timestamp: "00:10:08,000 → 00:10:23,000" },
      { speaker: "B", text: "I mean, for example, I'll give you a very simple example.", timestamp: "00:10:23,000 → 00:10:25,000" },
      { speaker: "B", text: "Everything that goes inside the West Bank goes through Israel.", timestamp: "00:10:25,000 → 00:10:26,000" },
      { speaker: "B", text: "All our supplies basically have to go through Israel.", timestamp: "00:10:26,000 → 00:10:30,000" },
      { speaker: "B", text: "And many times they won't allow these things.", timestamp: "00:10:30,000 → 00:10:41,000" },
      { speaker: "B", text: "So most of our equipment and supplies here, what we do is we find ways to bring it through, for example, some Israeli friends.", timestamp: "00:10:41,000 → 00:10:46,000" },
      { speaker: "B", text: "Or some international volunteers who bring them with them in the airport.", timestamp: "00:10:46,000 → 00:10:52,000" },
      { speaker: "B", text: "So we have to always be flexible and always think of how best to finish, do the job.", timestamp: "00:10:52,000 → 00:11:02,000" },
      { speaker: "B", text: "Despite all the incredible odds that we are facing as indigenous people.", timestamp: "00:11:02,000 → 00:11:11,000" },
      { speaker: "A", text: "OK, so this goes now like when there is no top technology available.", timestamp: "00:11:11,000 → 00:11:24,000" },
      { speaker: "A", text: "What role does the body, the human senses, such as walking, listening, observing, play as a scientific instrument in your research practice?", timestamp: "00:11:24,000 → 00:11:29,000" },
      { speaker: "A", text: "Because even when you are reduced with less technology, we still have our human senses.", timestamp: "00:11:29,000 → 00:11:39,000" },
      { speaker: "B", text: "Yeah, I tell people actually, you know, I am a fan of this concept called mindfulness.", timestamp: "00:11:39,000 → 00:11:53,000" },
      { speaker: "B", text: "We humans must be mindful and be immersed in our society, employing all our five senses.", timestamp: "00:11:53,000 → 00:12:06,000" },
      { speaker: "B", text: "And this is part of what we do with children.", timestamp: "00:12:06,000 → 00:12:12,000" },
      { speaker: "B", text: "We ask children, we don't teach them in the sense we don't give them a talk or a lecture or anything like that.", timestamp: "00:12:12,000 → 00:12:22,000" },
      { speaker: "B", text: "We create an environment for children to learn.", timestamp: "00:12:22,000 → 00:12:35,000" },
      { speaker: "B", text: "Just like I, yesterday I was planting some seeds and so forth before the rain.", timestamp: "00:12:35,000 → 00:12:51,000" },
      { speaker: "B", text: "The idea is to create an environment for the seeds to grow.", timestamp: "00:12:51,000 → 00:12:53,000" },
      { speaker: "B", text: "Soil, water, you know, air, sunlight.", timestamp: "00:12:53,000 → 00:12:58,000" },
      { speaker: "B", text: "And then they grow. And same with humans.", timestamp: "00:12:58,000 → 00:13:02,000" },
      { speaker: "B", text: "Humans grow their minds, grow their spirits, grow their bodies, their physical bodies by being immersed in nature.", timestamp: "00:13:02,000 → 00:13:07,000" },
      { speaker: "B", text: "And the five senses are our communication channels to nature, if you want.", timestamp: "00:13:07,000 → 00:13:10,000" },
      { speaker: "B", text: "So the museum that we are building, the institute we are building, I would like it to be, we collectively, would like it to be a place like that environment we create for the plants.", timestamp: "00:13:10,000 → 00:13:16,000" },
      { speaker: "B", text: "It would be an environment we create for humans to grow, to expand, to, you know, like you raise a child, you bring some toys and things so that the children can grow physically and grow mentally and spiritually.", timestamp: "00:13:16,000 → 00:13:19,000" },
      { speaker: "B", text: "This is our aim in this institute and how we try to work.", timestamp: "00:13:19,000 → 00:13:26,000" },
      { speaker: "B", text: "There's a Chinese saying that I like, it says, I hear and I forget, I see and I remember, I do and I understand.", timestamp: "00:13:26,000 → 00:13:38,000" },
      { speaker: "B", text: "So we'd like people to do things by hand, touch, feel, listen, you know, smell.", timestamp: "00:13:38,000 → 00:13:46,000" },
      { speaker: "B", text: "This is how they understand their life and understand the people.", timestamp: "00:13:46,000 → 00:13:49,000" },
      { speaker: "A", text: "Have you noticed any changes in species behaviors, seasonal rhythms and biodiversity that are not adequately captured by international environmental narratives?", timestamp: "00:13:57,000 → 00:14:03,000" },
      { speaker: "A", text: "For example, the West who have a privilege in capturing environmental data, such as species behavior, seasonal rhythms or biodiversity, what do you think is not adequately captured by international environmental narratives? What stories do international environmental narratives bring that are not correct or not showing the full situation?", timestamp: "00:14:06,000 → 00:14:15,000" },
      { speaker: "B", text: "I was reading a book yesterday on the Internet called I'm a recovering environmentalist.", timestamp: "00:14:15,000 → 00:14:21,000" },
      { speaker: "B", text: "It's kind of tongue-in-cheek title by an environmentalist actually who realized he's Western, I think he's Australian.", timestamp: "00:14:21,000 → 00:14:30,000" },
      { speaker: "B", text: "He was explaining how environmentalism globally has become very narrow.", timestamp: "00:14:30,000 → 00:14:38,000" },
      { speaker: "B", text: "For example, focusing only on climate change, saying climate change is the problem.", timestamp: "00:14:38,000 → 00:14:46,000" },
      { speaker: "B", text: "No, it's not the problem. It's one of many problems.", timestamp: "00:14:46,000 → 00:14:55,000" },
      { speaker: "B", text: "We have invasive species, we have pollution, we have habitat destruction.", timestamp: "00:14:55,000 → 00:15:02,000" },
      { speaker: "B", text: "We have colonialism, we have wars.", timestamp: "00:15:03,000 → 00:15:12,000" },
      { speaker: "B", text: "Wars produce more greenhouse gases than people know.", timestamp: "00:15:12,000 → 00:15:24,000" },
      { speaker: "B", text: "Israel produced more greenhouse gases from bombing Gaza and seven other countries in the last two years than Spain produced from all its sources in the same period of time.", timestamp: "00:15:24,000 → 00:15:27,000" },
      { speaker: "B", text: "That's just from jet fuels, jet fuel burning and producing greenhouse gases.", timestamp: "00:15:27,000 → 00:15:36,000" },
      { speaker: "B", text: "I think we need to widen our vision of what environmentalism means.", timestamp: "00:15:36,000 → 00:15:40,000" },
      { speaker: "B", text: "Our vision here at this institution, our philosophy, and one of these days I need to write a paper about this, our philosophy of environmentalism.", timestamp: "00:15:40,000 → 00:15:47,000" },
      { speaker: "B", text: "It's a comprehensive environmentalism that guards, as I said, that biological and human diversity.", timestamp: "00:15:47,000 → 00:15:53,000" },
      { speaker: "B", text: "This is very critical.", timestamp: "00:15:53,000 → 00:15:59,000" },
      { speaker: "B", text: "I cannot have environmentalism that says, well, we have to reduce greenhouse gases, go to alternative energy, and that's my environmentalism.", timestamp: "00:15:59,000 → 00:16:02,000" },
      { speaker: "B", text: "That's limiting your environmentalism.", timestamp: "00:16:02,000 → 00:16:12,000" },
      { speaker: "B", text: "Your environmentalism should also mean that you don't let children, I mean, just last 24 hours, 15 people were killed in Gaza, five of them are children.", timestamp: "00:16:12,000 → 00:16:18,000" },
      { speaker: "B", text: "That's environmentalism. You have to be involved in that. You have to address that. You have to talk about it.", timestamp: "00:16:18,000 → 00:16:27,000" },
      { speaker: "B", text: "You cannot say, well, I'm just focusing on using my Tesla as an electric car, as if that's solving an environmental problem.", timestamp: "00:16:27,000 → 00:16:33,000" },
      { speaker: "B", text: "No, it does not solve an environmental problem.", timestamp: "00:16:33,000 → 00:16:42,000" },
      { speaker: "B", text: "You're enriching somebody, Elon Musk, who's supporting wars that's producing far more in weapons and destruction and mayhem in the world and destruction of our environment by buying that Tesla.", timestamp: "00:16:42,000 → 00:16:54,000" },
      { speaker: "B", text: "And then you are by saving on gasoline and using electricity, which electricity, of course, has to be produced from other sources of energy, whether it's fuel or nuclear or what.", timestamp: "00:16:54,000 → 00:17:02,000" },
      { speaker: "B", text: "So you have to really think and think deeper and have better understanding.", timestamp: "00:17:02,000 → 00:17:07,000" },
      { speaker: "B", text: "And this is an important point also.", timestamp: "00:17:07,000 → 00:17:14,000" },
      { speaker: "B", text: "Knowledge is power. People have to get knowledge and institutions like ours, we must, that's our role.", timestamp: "00:17:14,000 → 00:17:22,000" },
      { speaker: "B", text: "We must consider our role also to produce knowledge and disseminate knowledge.", timestamp: "00:17:22,000 → 00:17:29,000" },
      { speaker: "B", text: "Without producing and disseminating knowledge, you cannot bridge what they call the science policy practice gaps.", timestamp: "00:17:29,000 → 00:17:31,000" },
      { speaker: "B", text: "How are you going to bridge the gaps if you have poor knowledge and poor dissemination of knowledge?", timestamp: "00:17:31,000 → 00:17:36,000" },
      { speaker: "A", text: "From an ecological perspective, how do you understand the air above Palestine as habitat, corridor, or shared ecological space?", timestamp: "00:17:52,000 → 00:18:01,000" },
      { speaker: "B", text: "Well, all of the above.", timestamp: "00:18:01,000 → 00:18:07,000" },
      { speaker: "B", text: "I mean, the air is a component of the biosphere that we deal with.", timestamp: "00:18:07,000 → 00:18:13,000" },
      { speaker: "B", text: "And there are actual living organisms in the air that we breathe.", timestamp: "00:18:13,000 → 00:18:18,000" },
      { speaker: "B", text: "Animals use the air, of course, not just for breathing, but also for insects cannot survive without air.", timestamp: "00:18:18,000 → 00:18:22,000" },
      { speaker: "B", text: "Air pollution will impact everything.", timestamp: "00:18:22,000 → 00:18:31,000" },
      { speaker: "B", text: "So when you see cities that are heavily polluted, like Lahore in Pakistan, humans suffer.", timestamp: "00:18:31,000 → 00:18:42,000" },
      { speaker: "B", text: "Skin disorders increase, cancers, birth defects, infertility, abortions, all of these things increase due to pollution of the air.", timestamp: "00:18:42,000 → 00:18:50,000" },
      { speaker: "B", text: "So it is critical when we talk, as I mentioned earlier, jet fuels of Israeli airplanes who are flying all over our space here, producing all these chemicals, they're not just producing CO2, they are producing all sorts of chemicals that come to the land also via the rain.", timestamp: "00:18:50,000 → 00:18:56,000" },
      { speaker: "B", text: "For example, now we have rain, the rain brings down all those pollutants to the soil.", timestamp: "00:18:56,000 → 00:18:59,000" },
      { speaker: "B", text: "We notice, for example, globally, the acid rain is increasing.", timestamp: "00:18:59,000 → 00:19:05,000" },
      { speaker: "B", text: "The pH of the rain is becoming lower, so it's acid rain.", timestamp: "00:19:05,000 → 00:19:06,000" },
      { speaker: "B", text: "Acid rain dissolves calcium, calcium carbonates and things like that, and makes less calcium available for birds, for example, to build their shells.", timestamp: "00:19:06,000 → 00:19:09,000" },
      { speaker: "B", text: "So we see egg shells that are in nests that are fragile and break easily, not like they used to be before.", timestamp: "00:19:09,000 → 00:19:13,000" },
      { speaker: "B", text: "And they used to be much stronger, egg shells, and so the fertility among birds is declining.", timestamp: "00:19:13,000 → 00:19:21,000" },
      { speaker: "B", text: "All of this is related to air. All of this is related to the human pollution of the air.", timestamp: "00:19:21,000 → 00:19:26,000" },
      { speaker: "B", text: "And we could cite many, many other examples of this.", timestamp: "00:19:26,000 → 00:19:36,000" },
      { speaker: "B", text: "So the air is a significant component of having a healthy ecosystem.", timestamp: "00:19:36,000 → 00:19:44,000" },
      { speaker: "A", text: "Well, bird migration creates invisible networks in the sky, connecting Palestine to Africa, Europe, and Asia.", timestamp: "00:19:44,000 → 00:19:53,000" },
      { speaker: "A", text: "How important are these aerial connections for understanding Palestine's ecology?", timestamp: "00:19:53,000 → 00:19:56,000" },
      { speaker: "B", text: "I mean, also this brings up another issue.", timestamp: "00:19:56,000 → 00:20:05,000" },
      { speaker: "B", text: "You cannot talk about air and the air component of the biosphere separately from other areas.", timestamp: "00:20:05,000 → 00:20:08,000" },
      { speaker: "B", text: "Since you bring up the birds, we estimate that over 500 million birds migrated through Palestine annually to Africa and back to places in Europe and Asia, right?", timestamp: "00:20:08,000 → 00:20:17,000" },
      { speaker: "B", text: "They pass through Palestine. What do they use?", timestamp: "00:20:17,000 → 00:20:20,000" },
      { speaker: "B", text: "They use air currents coming up, for example, in the mountains and so forth, so that they conserve energy.", timestamp: "00:20:20,000 → 00:20:27,000" },
      { speaker: "B", text: "But even if they conserve energy through air currents and so forth, they still need to rest occasionally.", timestamp: "00:20:27,000 → 00:20:31,000" },
      { speaker: "B", text: "They have to land somewhere, especially to drink water.", timestamp: "00:20:31,000 → 00:20:37,000" },
      { speaker: "B", text: "And so when Israel basically dried up the wetlands of the Hula and the Lake Hula area in the north to make farmlands, European-style farmlands in the north of Palestine, this is very damaging to our environment.", timestamp: "00:20:37,000 → 00:20:48,000" },
      { speaker: "B", text: "When Israel diverted the water of the Jordan River from the east to the west, not because they really need the water, it's because they wanted to deprive the Palestinians of the water of the Jordan River Basin.", timestamp: "00:20:48,000 → 00:20:52,000" },
      { speaker: "B", text: "So Jordan River, which used to flow at 1,350 million cubic meters per year, now flows at about 20 million cubic meters per year.", timestamp: "00:20:52,000 → 00:21:04,000" },
      { speaker: "B", text: "That's barely a stream, cannot really accommodate migrating birds.", timestamp: "00:21:04,000 → 00:21:10,000" },
      { speaker: "B", text: "So what happened? We don't have enough studies, by the way, to tell what impact all of these things had on bird migration.", timestamp: "00:21:10,000 → 00:21:19,000" },
      { speaker: "B", text: "So it's not just the earth, the air, but also the land, the water, the hunting, all of these things, threats to our ecosystem, to our global ecosystem, to our Mother Earth.", timestamp: "00:21:19,000 → 00:21:24,000" },
      { speaker: "B", text: "We, the indigenous people, we call it Mother Earth because we believe it's sacred and that we have to respect Mother Earth, not to destroy Mother Earth.", timestamp: "00:21:24,000 → 00:21:31,000" },
      { speaker: "B", text: "So every aspect of Mother Earth is under assault these days because of rampant capitalism, neoliberal attitudes, colonialism, imperialism, Zionism, all these isms that are assaulting our nature, our human nature and our biological nature.", timestamp: "00:21:31,000 → 00:21:34,000" },
      { speaker: "A", text: "I recently went to the Kasseria archaeological site in the desert Al-Zarqa, and there was a fish farming site where there were so many birds because of all the fish.", timestamp: "00:21:34,000 → 00:21:44,000" },
      { speaker: "A", text: "But it almost looked like a bird monitoring site because there were so many birds. Do you know much about this?", timestamp: "00:21:44,000 → 00:21:50,000" },
      { speaker: "B", text: "Well, I mean, birds adjust a little bit and when you have fish farming or even artificial lakes land on them, even trash dump sites in the Jordan Valley, bird migrations settle around trash dump sites, thinking they can find something edible in the trash.", timestamp: "00:21:50,000 → 00:21:59,000" },
      { speaker: "B", text: "So they tried to adapt, but as I said, we need much more studies to understand the impact.", timestamp: "00:21:59,000 → 00:22:05,000" },
      { speaker: "B", text: "We did one study, by the way, with an intern here, Reena Saeed, who looked at the book, old book by Tristram, who described birds in Palestine and compared what Tristram observed in 1865 with what we observe today in terms of birds and bird migrations and so forth.", timestamp: "00:22:05,000 → 00:22:08,000" },
      { speaker: "B", text: "And obviously there was dramatic loss of bird fauna in Palestine in the last 150 years or so, whether that's due to climate change, human destruction of habitats or other things, or diversions of water and so on.", timestamp: "00:22:08,000 → 00:22:22,000" },
      { speaker: "B", text: "We don't know the exact components of this. Probably all of the above impacted this loss, but we do know that there's a loss of migration and migratory routes and also a loss of some species like the fishing owl, where you mentioned there was an owl species called the fishing owl, literally lived off of eating the fish from the Zarqa River.", timestamp: "00:22:22,000 → 00:22:29,000" },
      { speaker: "B", text: "And this one's extinct, it's no longer found. Why did it go extinct? I'm sure it has to do with human activities, but which human activities? Building dams around the river, restricting flows, over-extraction of flows, a drop in rainfall, a combination of all the above is the most likely answer.", timestamp: "00:22:29,000 → 00:22:35,000" },
      { speaker: "A", text: "Thank you for clarifying that because I only visited for a few days, but I thought it was quite strange what I saw with the fish farming, the whole land's been transformed.", timestamp: "00:22:35,000 → 00:22:44,000" },
      { speaker: "B", text: "Yeah, the landscape here is, I mean, if you came back, if you went back in time 100 years ago, you would see a significant transformation of the land. This was a land that hasn't changed in thousands of years, literally, with human habitation, with human going from hunting gathering to agriculture and domestication of animals.", timestamp: "00:22:44,000 → 00:22:48,000" },
      { speaker: "B", text: "And pastoralism, 12,000 years ago, the landscape remained relatively stable. But in the last 150 years, it was completely transformed. And I call it scarred, you know, scarred landscape.", timestamp: "00:22:48,000 → 00:23:01,000" },
      { speaker: "B", text: "So we really need to rethink our policies as humans. And we the indigenous people try to tell the colonizers and anybody who would listen, you're not doing even yourself as a colonizer a favor by doing this.", timestamp: "00:23:10,000 → 00:23:14,000" },
      { speaker: "B", text: "Bombing Gaza, for example, and letting the Gaza people not have sewage treatment facilities that function and their sewage runs into the Mediterranean Sea that's scarring the sea, not just scarring the land.", timestamp: "00:23:14,000 → 00:23:22,000" },
      { speaker: "B", text: "And the sewage of Gaza flows north because of the currents from the Suez Canal. And so literally the Israelis are swimming in the shit of Gaza and Jaffa and Tel Aviv because our government thinks short term destruction of the people of Gaza instead of thinking long term habitation and health of the Mediterranean Sea.", timestamp: "00:23:22,000 → 00:23:38,000" },
      { speaker: "B", text: "Health of the Mediterranean or health of the environment, health of the air, health of the land. They don't think that way. They destroyed millions of trees, for example.", timestamp: "00:23:38,000 → 00:23:49,000" },
      { speaker: "A", text: "Like fast engineering, you only care about fast engineering.", timestamp: "00:23:49,000 → 00:23:55,000" },
      { speaker: "B", text: "And then they planted only pine trees for many decades. That's a tree they planted.", timestamp: "00:23:55,000 → 00:24:01,000" },
      { speaker: "B", text: "The tree that doesn't even survive here, the wood is different.", timestamp: "00:24:01,000 → 00:24:07,000" },
      { speaker: "A", text: "I want to go back to the sky a little bit because you talked about the air.", timestamp: "00:24:22,000 → 00:24:28,000" },
      { speaker: "A", text: "I'm trying to look at what is the sort of air that becomes restricted and also as the last remaining space of ecological continuity because there's restricted zones in the sky, but for birds, they can still fly through those restricted zones.", timestamp: "00:24:28,000 → 00:24:38,000" },
      { speaker: "A", text: "Because you work a lot of biodiversity and you talked about the air and also how the rain is polluting the ground.", timestamp: "00:24:38,000 → 00:24:47,000" },
      { speaker: "A", text: "What is your perception of air because it's the air you breathe and it's also a sense that you experience every day?", timestamp: "00:24:47,000 → 00:24:55,000" },
      { speaker: "B", text: "Well, as you said, air is a continuous material that when Israel builds walls, apartheid segregation walls to isolate Palestinians from their land and from each other, that impacts a lot.", timestamp: "00:24:55,000 → 00:25:02,000" },
      { speaker: "B", text: "It impacts humans. It impacts nature. It impacts water flows.", timestamp: "00:25:02,000 → 00:25:06,000" },
      { speaker: "B", text: "For example, it impacts biodiversity because land mammals, of course, cannot cross walls, large mammals, etc.", timestamp: "00:25:06,000 → 00:25:13,000" },
      { speaker: "B", text: "This all is impacted by walls and fences and so on.", timestamp: "00:25:14,000 → 00:25:20,000" },
      { speaker: "B", text: "But also you cannot think of birds as somehow immune from this thing.", timestamp: "00:25:20,000 → 00:25:26,000" },
      { speaker: "B", text: "I mean, if you look at the satellite image around Gaza and the difference between Gaza today, Gaza Strip and what surrounds it, Gaza is, of course, devastated, environmentally catastrophic.", timestamp: "00:25:26,000 → 00:25:30,000" },
      { speaker: "B", text: "We looked at this using remote sensing, for example, destruction of greenhouses, destruction of tree covers, destruction of natural habitats.", timestamp: "00:25:30,000 → 00:25:38,000" },
      { speaker: "B", text: "It's devastated. This impacts the air of Gaza, of course, because air is produced by this biotic interaction, not just the physical component of air.", timestamp: "00:25:38,000 → 00:25:52,000" },
      { speaker: "B", text: "So if you destroy the Amazon, certainly the air globally will be impacted, not just locally in the Amazon.", timestamp: "00:25:52,000 → 00:26:02,000" },
      { speaker: "B", text: "So if you look at the satellite image of Gaza, what is this wall going to do? Is it going to isolate the air of Gaza away from the air of Tel Aviv and Jaffa?", timestamp: "00:26:02,000 → 00:26:09,000" },
      { speaker: "B", text: "No, it is all a continuous matrix that is going to be impacted.", timestamp: "00:26:09,000 → 00:26:13,000" },
      { speaker: "B", text: "Pollution in Gaza is going to reach everywhere, including the Americas, not just there.", timestamp: "00:26:13,000 → 00:26:20,000" },
      { speaker: "B", text: "So that is why air component is a significant component of these things and people have to understand the connectivity.", timestamp: "00:26:20,000 → 00:26:28,000" },
      { speaker: "B", text: "I go back to this notion that we indigenous people have that there's mother earth, there's living earth, and biology has proven this.", timestamp: "00:26:28,000 → 00:26:31,000" },
      { speaker: "B", text: "Even though the indigenous wisdom existed for thousands of years, only now biologists, have you heard, for example, the butterfly effect?", timestamp: "00:26:31,000 → 00:26:41,000" },
      { speaker: "B", text: "Some butterfly in Amazon maybe flapping its wings could cause a hurricane somewhere else, because everything is connected.", timestamp: "00:26:41,000 → 00:26:47,000" },
      { speaker: "B", text: "Everything is tied together. Earth is this one breathing new planet that is not separated by these artificial human borders that were created.", timestamp: "00:26:47,000 → 00:26:58,000" },
      { speaker: "B", text: "That's a separate issue which one day I want to write a paper on maybe with Emil or somebody about the borders we have.", timestamp: "00:26:58,000 → 00:27:03,000" },
      { speaker: "B", text: "Borders are not just the physical borders and checkpoints and going in and out of countries.", timestamp: "00:27:03,000 → 00:27:13,000" },
      { speaker: "B", text: "There's also the mental borders that people create in their own mind about what is it that we as humans, am I connected to people living, let's say, in Hong Kong?", timestamp: "00:27:13,000 → 00:27:22,000" },
      { speaker: "B", text: "Of course I am. We are part of this tiny planet.", timestamp: "00:27:22,000 → 00:27:30,000" },
      { speaker: "B", text: "When you think of its size relative to just our own galaxy, for example, it's nothing. It's spec, but it's all connected.", timestamp: "00:27:30,000 → 00:27:41,000" },
      { speaker: "B", text: "And if we don't pay attention, we're destroying this planet.", timestamp: "00:27:41,000 → 00:27:44,000" },
      { speaker: "A", text: "And also in your papers on militarization, because now thinking about the scarred landscape, the scarred air, the scarred organisms that we're living in.", timestamp: "00:27:44,000 → 00:27:50,000" },
      { speaker: "A", text: "I mean, you often describe the landscape as shaped by militarization, walls, firing zones, settlements, military bases.", timestamp: "00:27:50,000 → 00:27:57,000" },
      { speaker: "A", text: "And you already spoke a little bit about the infrastructure's functions as ecological forces, because you speak a lot about walls and borders.", timestamp: "00:27:57,000 → 00:28:01,000" },
      { speaker: "A", text: "But this is also militarization as well. This ideology of militarization is using walls.", timestamp: "00:28:01,000 → 00:28:07,000" },
      { speaker: "A", text: "So I guess I'm trying to understand about looking at ecological forces like our body proximities, for example, our human organisms, our vibrations with the connection with land and air.", timestamp: "00:28:07,000 → 00:28:17,000" },
      { speaker: "A", text: "How is the militarization deepening the scars?", timestamp: "00:28:17,000 → 00:28:20,000" },
      { speaker: "B", text: "Yeah, this is a very important question. The way the world is now has moved.", timestamp: "00:28:20,000 → 00:28:28,000" },
      { speaker: "B", text: "Since really the Industrial Revolution and the European colonizations, even before that, European colonizations of the developing world, as they call it, or the Third World, sometimes they call us derogatively, the Global South, if you want.", timestamp: "00:28:28,000 → 00:28:38,000" },
      { speaker: "B", text: "And the idea of the world and the direction has always been a competition between two groups of individuals, two collections.", timestamp: "00:28:38,000 → 00:28:47,000" },
      { speaker: "B", text: "There's a group of individuals that's a tiny minority that thinks of profit and money and resources as commodities to be used for their own purposes, not caring about other people or other environments, whatever.", timestamp: "00:28:47,000 → 00:28:56,000" },
      { speaker: "B", text: "This selfishness of this clique of people and the other group of people, indigenous people and others, want to preserve Earth long term and have sustainability.", timestamp: "00:28:56,000 → 00:29:02,000" },
      { speaker: "B", text: "Sustainability is an important word, and I don't think necessarily of sustainable development, because to me, a tribe in the Amazon doesn't need to develop.", timestamp: "00:29:02,000 → 00:29:11,000" },
      { speaker: "B", text: "It's living happily in nature, environment, collaboration with nature long term.", timestamp: "00:29:11,000 → 00:29:19,000" },
      { speaker: "B", text: "Sit down if you want to listen.", timestamp: "00:29:19,000 → 00:29:21,000" },
      { speaker: "B", text: "So it's an important component to have sustainability.", timestamp: "00:29:21,000 → 00:29:30,000" },
      { speaker: "B", text: "The struggle between those two groups has been going on for a long time, but it is now accelerating.", timestamp: "00:29:30,000 → 00:29:38,000" },
      { speaker: "B", text: "And the amount of destruction that humans are capable of inflicting on nature and fellow human beings has expanded dramatically in the last few decades with nuclear weapons, for example, with technology that allows us to produce more greenhouse gases, et cetera.", timestamp: "00:29:38,000 → 00:29:45,000" },
      { speaker: "B", text: "I mean, AI alone, think of how much energy is going to be consumed by AI and so forth.", timestamp: "00:29:45,000 → 00:29:51,000" },
      { speaker: "B", text: "This adds the stress rare minerals now people are fighting for.", timestamp: "00:29:51,000 → 00:30:02,000" },
      { speaker: "B", text: "So the group that is the tiny group, the less than 1% of the population who wants to just profit and increase the riches and so forth, they are working overtime to basically destroy and plan how to destroy and plan how to subjugate the other 99%.", timestamp: "00:30:02,000 → 00:30:07,000" },
      { speaker: "B", text: "That's where you see militarization comes in, militarization of police in the US, for example, with ICE agents that just killed a woman, 37-year-old mother in Minneapolis.", timestamp: "00:30:07,000 → 00:30:16,000" },
      { speaker: "B", text: "This is what they are doing.", timestamp: "00:30:16,000 → 00:30:22,000" },
      { speaker: "B", text: "And Israel is a big component of this because it trains American police and so forth and militarizing police and things like that.", timestamp: "00:30:22,000 → 00:30:28,000" },
      { speaker: "B", text: "These people are connected to each other who want to oppress and destroy and exclude and keep people busy hating others, for example, hating Muslims, Islamophobia, hating immigrants, hating this, hating that.", timestamp: "00:30:28,000 → 00:30:38,000" },
      { speaker: "B", text: "Why? They want you to stay busy in a divisive world where you are pitted, all the masses are pitted against each other instead of thinking about their future and their long-term sustainability.", timestamp: "00:30:38,000 → 00:30:43,000" },
      { speaker: "B", text: "That's what they want to do.", timestamp: "00:30:43,000 → 00:30:47,000" },
      { speaker: "B", text: "So I think it's critical that we understand the connection of militarization and why Donald Trump now wants to increase the military budget from $1 trillion to $1.5 trillion.", timestamp: "00:30:47,000 → 00:30:52,000" },
      { speaker: "B", text: "And he says, we can afford it. What's we can afford? You can afford it.", timestamp: "00:30:52,000 → 00:30:58,000" },
      { speaker: "B", text: "The people of America now, they have $38 trillion in debt if you divide it by the population.", timestamp: "00:30:58,000 → 00:31:02,000" },
      { speaker: "B", text: "And I am a US citizen, by the way. I have debt that I have to pay.", timestamp: "00:31:02,000 → 00:31:08,000" },
      { speaker: "B", text: "You divide among the population $50,000 or $100,000 in debt before the government because the government takes the taxes, spends them, but they don't have enough to spend on all the military and all this stuff.", timestamp: "00:31:08,000 → 00:31:12,000" },
      { speaker: "B", text: "And the military is the largest expense a US does.", timestamp: "00:31:12,000 → 00:31:19,000" },
      { speaker: "B", text: "So this is all connected and understanding the world like this.", timestamp: "00:31:19,000 → 00:31:25,000" },
      { speaker: "B", text: "I mean, I'm in my resolution for 2026 actually is to write more paper explaining these connecting the dots.", timestamp: "00:31:25,000 → 00:31:30,000" },
      { speaker: "B", text: "My last email was about connecting the dots about Venezuela. Why Venezuela? Why are people attacking?", timestamp: "00:31:30,000 → 00:31:36,000" },
      { speaker: "B", text: "It's not just oil, by the way. It has to do with Israel. It has to do with rare minerals.", timestamp: "00:31:36,000 → 00:31:40,000" },
      { speaker: "B", text: "It has to do with this militarization and this keeping us busy thinking about the Venezuelan people sending drugs to America.", timestamp: "00:31:40,000 → 00:31:46,000" },
      { speaker: "B", text: "Let's fight that. You know, keeping people busy so that they keep pillaging, pillaging other people and pillaging the earth and destroying the earth.", timestamp: "00:31:46,000 → 00:31:49,000" },
      { speaker: "A", text: "Because you have worked with different organizations, even with like someone such as Yoshi Lesham who was in charge of the Aero networks in the past.", timestamp: "00:31:57,000 → 00:32:04,000" },
      { speaker: "A", text: "And now you're a bit more resilient about how you are spreading your knowledge and who you're sharing it with.", timestamp: "00:32:04,000 → 00:32:12,000" },
      { speaker: "A", text: "I want to understand the complexities of this because obviously as a Palestinian, he wants to bring the resistance back to the land and the justice.", timestamp: "00:32:12,000 → 00:32:17,000" },
      { speaker: "A", text: "I want to understand what it is that the complexities are involved in this.", timestamp: "00:32:17,000 → 00:32:20,000" },
      { speaker: "A", text: "As in like your collaborations with sort of looking after ecological biodiversity because you're in occupied Palestine.", timestamp: "00:32:28,000 → 00:32:32,000" },
      { speaker: "B", text: "I mean, I think by accident of birth, I was born in Palestine and I consider that to be a lucky accident of birth for me because Palestine is like the canary in the mine.", timestamp: "00:32:32,000 → 00:32:40,000" },
      { speaker: "B", text: "You know, it exposes all of these issues that we were talking about earlier.", timestamp: "00:32:40,000 → 00:32:48,000" },
      { speaker: "B", text: "It's a Achilles heel of Western hypocrisy and the Achilles heel of rampant capitalism that's gone unchecked for many decades, pillaging the world in the name of Western so-called democracies.", timestamp: "00:32:48,000 → 00:32:56,000" },
      { speaker: "B", text: "There's no democracies, by the way, in the West because it's money, the interests that determine whether it's this guy becomes president or that guy becomes president or and so on.", timestamp: "00:32:56,000 → 00:33:02,000" },
      { speaker: "B", text: "It's money, the interests in the West, whether it's in Britain or France or the U.S.", timestamp: "00:33:02,000 → 00:33:11,000" },
      { speaker: "B", text: "That's what we call Western democracy.", timestamp: "00:33:11,000 → 00:33:19,000" },
      { speaker: "B", text: "And it's a democracy if it is democracy for white elites, it's to pillage the rest of the world and keep sucking up the indigenous water, land, resources, you know, rare minerals, oil.", timestamp: "00:33:19,000 → 00:33:25,000" },
      { speaker: "B", text: "This is what it is about.", timestamp: "00:33:25,000 → 00:33:29,000" },
      { speaker: "B", text: "So, as I said, what is our role? Our role as indigenous peoples to work together.", timestamp: "00:33:29,000 → 00:33:34,000" },
      { speaker: "B", text: "But why Palestine is important?", timestamp: "00:33:34,000 → 00:33:38,000" },
      { speaker: "B", text: "Palestine exposes hypocrisy more than anywhere else, especially with the genocide and ecocide and scholasticity and medicite that has gone on for now over several decades, but accelerated in the past 26 months in the Gaza Strip.", timestamp: "00:33:38,000 → 00:33:45,000" },
      { speaker: "B", text: "A destruction of our health care, a destruction of our nature, etc.", timestamp: "00:33:45,000 → 00:33:49,000" },
      { speaker: "B", text: "This exposes Western hypocrisy and it plays a heavy burden on my shoulders and the shoulders of all Palestinians to speak out and to educate and to do institutions like this institution.", timestamp: "00:33:49,000 → 00:33:57,000" },
      { speaker: "B", text: "We plan, by the way, if they allow us to replicate this institution in the Gaza Strip, if they allow rebuilding in Gaza.", timestamp: "00:33:57,000 → 00:34:05,000" },
      { speaker: "B", text: "So that's where it places the burden on us.", timestamp: "00:34:05,000 → 00:34:11,000" },
      { speaker: "B", text: "But the burden on us is leading this because we are at the front line of the struggle.", timestamp: "00:34:11,000 → 00:34:17,000" },
      { speaker: "B", text: "But as I said, it's not a struggle for the Palestinians.", timestamp: "00:34:17,000 → 00:34:21,000" },
      { speaker: "B", text: "It's a struggle for the global 99.8% of the world that's not profiting from this.", timestamp: "00:34:21,000 → 00:34:28,000" },
      { speaker: "B", text: "People are losing jobs.", timestamp: "00:34:28,000 → 00:34:30,000" },
      { speaker: "B", text: "Young people don't have jobs around the world, whether it's in the US, China or Japan or anywhere else.", timestamp: "00:34:30,000 → 00:34:34,000" },
      { speaker: "B", text: "Because the corporations have been spending all the past few decades thinking of how best to reduce the workforce, not increase the workforce.", timestamp: "00:34:34,000 → 00:34:38,000" },
      { speaker: "B", text: "Because for them, people working for corporations reduces your profits.", timestamp: "00:34:38,000 → 00:34:42,000" },
      { speaker: "B", text: "So you want less workers.", timestamp: "00:34:42,000 → 00:34:45,000" },
      { speaker: "B", text: "You want automation.", timestamp: "00:34:45,000 → 00:34:48,000" },
      { speaker: "B", text: "You want more money going to the billionaires.", timestamp: "00:34:48,000 → 00:34:50,000" },
      { speaker: "B", text: "And Elon Musk will be the first human trillionaire.", timestamp: "00:34:50,000 → 00:34:54,000" },
      { speaker: "B", text: "Imagine not just a billionaire.", timestamp: "00:34:54,000 → 00:34:58,000" },
      { speaker: "B", text: "He already has $350 billion or $400 billion.", timestamp: "00:34:58,000 → 00:35:01,000" },
      { speaker: "B", text: "But he's slated to become the first human trillionaire.", timestamp: "00:35:01,000 → 00:35:06,000" },
      { speaker: "B", text: "That means $1,000 billion.", timestamp: "00:35:06,000 → 00:35:10,000" },
      { speaker: "B", text: "Which is enough, of course, to make every human being on Earth live comfortably at the survival level.", timestamp: "00:35:10,000 → 00:35:14,000" },
      { speaker: "A", text: "I guess also like with your collaborations, you're also trying to withstand normalization.", timestamp: "00:35:14,000 → 00:35:20,000" },
      { speaker: "A", text: "You don't want a normalization, a globalization of militarization or being restricted from your land as well.", timestamp: "00:35:20,000 → 00:35:26,000" },
      { speaker: "B", text: "Yeah, I mean, the reason they hate us most of all is because we show this hypocrisy.", timestamp: "00:35:26,000 → 00:35:32,000" },
      { speaker: "B", text: "Because we show that you cannot normalize with people who are destroying our planet.", timestamp: "00:35:32,000 → 00:35:37,000" },
      { speaker: "B", text: "You cannot normalize with people who are destroying the planet.", timestamp: "00:35:37,000 → 00:35:42,000" },
      { speaker: "B", text: "You have to defeat them. You have to defeat them.", timestamp: "00:35:42,000 → 00:35:46,000" },
      { speaker: "B", text: "And I'm not talking about defeating them militarily or by fighting, but we have to defeat them because we're the majority.", timestamp: "00:35:46,000 → 00:35:51,000" },
      { speaker: "B", text: "We're the biggest part of the population.", timestamp: "00:35:51,000 → 00:35:54,000" },
      { speaker: "B", text: "And if we all put our hands together and we remove the brainwashing, you know, that they do to us through these tasks we talked about earlier, divide and conquer kind of thing, making us worry about religions or about this or that.", timestamp: "00:35:54,000 → 00:35:58,000" },
      { speaker: "B", text: "And instead of worrying about whether there will be humans living on Earth in a few years or it will be infested by cockroaches because they are resistant to nuclear radiation.", timestamp: "00:35:58,000 → 00:36:03,000" },
      { speaker: "B", text: "That is what they want us to stay busy with.", timestamp: "00:36:03,000 → 00:36:08,000" },
    ],
  },

   // -------- INTERVIEW 2: Anton Khalilieh (full transcript) --------
  {
    id: 2,
    title: "Interviewee: C",
    meta: "Co‑founder and executive director of Nature Palestine Society",
    date: "Recorded in Ramallah, 2026",
    transcript: [
      { speaker: "A", text: "Can you please introduce yourself, your position, and where you’re from?", timestamp: "00:00:00" },
      { speaker: "B", text: "My name is Anton Khalilieh. I hold a PhD in eco-physiology and conservation. I was born in Beit Jala city (بيت جالا), which is located in the Bethlehem district, West Bank, Palestine. I am the co-founder and now the executive director of Nature Palestine Society. It is a Palestinian non-governmental organisation established in 2017.", timestamp: "00:00:14" },
      { speaker: "A", text: "Can you please describe your first encounter with birds or birding?", timestamp: "00:01:01" },
      { speaker: "B", text: "That was back in 1991, when I was 12 years old. I used to go with my father. He used to hunt birds with old techniques. For me, starting to go with my father, I was in love with birds. But suddenly I noticed that we were killing the birds to eat them – which was somewhat justified back in the 80s and 90s. But from there, I was really into birds. At some point I decided that I don’t want to kill birds or eat wild birds. From there, my journey started with birds. It was a strange thing when it started.", timestamp: "00:01:02" },
      { speaker: "B", text: "When I started birding or birdwatching, that was 2002. It was my first time with a camera and a small binocular, taking photos of birds and starting birdwatching. At that time, I started looking at wildlife in a different way. I started reading about birds in general, about conservation. I couldn’t find much information because we didn’t have easy internet access back then – it wasn’t a popular thing. So slowly I started to buy books and read more. From there, I started working with another Palestinian NGO in the field of research, birdwatching and conservation.", timestamp: "00:02:26" },
      { speaker: "A", text: "What was the first thing you observed about birds when you were young, with your father, that connected you to them?", timestamp: "00:03:30" },
      { speaker: "B", text: "Their movement – how they fly, how they are capable of flying from one shrub to another, from one tree to another. How they can find their way, their colours. And even sometimes you don’t see the bird, you just hear the voice or the call. Sometimes we just sit and try to find where the bird is making that sound. I think movement, colour and sound are really the things that attract me to birds – these are the first things I look at. Movement and sound are first, then their colours.", timestamp: "00:03:41" },
      { speaker: "A", text: "Did you always know you would be in the profession you are today? Do you see yourself as a scientist, conservationist, field observer, educator, or an advocate for conservation? You seem very transdisciplinary.", timestamp: "00:04:43" },
      { speaker: "B", text: "That’s a good question. I am a researcher. I am a conservationist. I am an educator and an advocate for conservation. The way I look at these things is trying to make the picture complete. You cannot just be a conservationist without doing research. It all comes together for different reasons. First, it’s something I love to do. At the same time, we lack expertise in Palestine in conservation and research, especially in the field of birds. So when we established Nature Palestine Society, we looked at the whole picture. One of the reasons we established it is that we found a gap between the government, local communities, and conservation. We are trying to fill that gap one way or another. So I fit within the three or four categories you mentioned.", timestamp: "00:04:59" },
      { speaker: "A", text: "What responsibilities come with this position?", timestamp: "00:06:22" },
      { speaker: "B", text: "Huge responsibility. Sometimes we have to make hard decisions. Taking hard decisions is one part. The other part is dealing with the consequences – we have to convince our government, like the Ministry of Agriculture or the Environment Quality Authority. Sometimes we have to make hard decisions in different ways, especially when talking about conservation, because we are not living in a normal situation as Palestinians. We live under occupation. Sometimes the government has other priorities than conservation, birds, and wildlife. We play a major role as a mediator between local communities, conservation, and decision makers – trying to fit within these different things, simply because we are not living in a normal situation.", timestamp: "00:06:27" },
      { speaker: "A", text: "Do you give consultation to the Palestinian Authority on developing conservation actions? And does the Palestinian Authority have to coordinate with the Israeli authority as well?", timestamp: "00:07:52" },
      { speaker: "B", text: "Definitely. And this creates huge obstacles for us as Palestinian NGOs or even governmental bodies. Let’s say we’re talking about nature reserves. Most of our nature reserves in the West Bank are in Area C, which means Palestinians don’t have authority over them. With that in mind, we have to work with local communities living within or around these nature reserves, and we have to conduct surveys. One way or another, we have to do this work. But when it comes to a major decision, sometimes even the Palestinian Authority cannot give us permission to do specific things because these areas are in Area C – not Area A or B. All Area C is under Israeli control.", timestamp: "00:08:09" },
      { speaker: "A", text: "Can you name some of the areas in Area C?", timestamp: "00:09:11" },
      { speaker: "B", text: "Most of Area C is where there are not many Palestinian urban areas – outside Palestinian cities, towns or villages. At the same time, if you talk about nature reserves around the Dead Sea, for example, it’s not easy for us to access these areas. Even east of Tubas or Jenin, we have several nature reserves there. It’s not easy to access them, especially after the 7th of October.", timestamp: "00:09:15" },
      { speaker: "A", text: "How do you understand bird migration in Palestine – looking at ecological and physical conditions, including phenomena that science cannot fully explain? And how do you understand it as both a historical and geopolitical phenomenon? Because migration involves birds navigating the sky as well as responding to what is on the ground – like the disappearance of flora and fauna, and where they decide to go. Do you sense phenomena happening that science cannot predict?", timestamp: "00:10:16" },
      { speaker: "B", text: "Palestine is located on the second most important migratory route, especially for soaring birds. Birds don’t recognise borders. We look at bird migration, especially for soaring birds, as a way to look for freedom. I don’t know if other people think about it this way, but believing that migratory birds don’t recognise borders – they cross any border without a checkpoint – shows me that this is freedom. This is what we are looking for. At the same time, Palestine’s location on this major migration route is part of how bird migration in our region evolved. Even human migration from Africa to Europe started within what we call the Great Rift Valley, which is a major migration route for birds. So the whole area here is part of the evolution of migration – for both humans and birds.", timestamp: "00:10:52" },
      { speaker: "B", text: "If we look at birds in the past, things were different than today. Birds used to move or stay through their migration in Palestine in a different way. For example, the Jordan Valley used to have more safe areas where they could stay for longer periods. These days, with the political situation and what’s happening in the West Bank, it seems birds are starting to learn which sites are safe and which are not – they avoid unsafe sites. In the past, the Hula Valley (now in Israel) was drained a long time ago for agriculture by the Jews before the establishment of Israel. Through that drying, birds stopped roosting or overwintering there. Recently, things changed again – the Israeli authorities rehabilitated part of the Hula Valley, and other birds, especially cranes, started to overwinter there again, and they are supporting them. So the political situation plays a major role. Climate change is also playing a major part.", timestamp: "00:12:34" },
      { speaker: "B", text: "Most Palestinians live in Area A and B. Because of that, many good birding sites within Area A and B became more organised areas, so not much good habitat remains for birds there. We see fewer numbers of birds. We still see the same species, unless their breeding population has declined. What we are facing in Area A and B is not about migratory species, but about local breeding and summer breeding species – their decline is really alarming now. We have lost several bird species that no longer breed in Area A and B.", timestamp: "00:14:26" },
      { speaker: "A", text: "What would you say is the main culprit for them not breeding?", timestamp: "00:15:47" },
      { speaker: "B", text: "Urban expansion, hunting, habitat destruction.", timestamp: "00:15:55" },
      { speaker: "A", text: "Who are hunting them?", timestamp: "00:16:07" },
      { speaker: "B", text: "Hunting by Palestinians. This is one of our major issues – hunting, poaching, disturbance. I’m not going to give excuses for Palestinians, but because of the political situation, income is low. Some people make hunting part of their income by selling birds – selling chicks of raptors, owls.", timestamp: "00:16:07" },
      { speaker: "A", text: "They are taking raptors?", timestamp: "00:16:54" },
      { speaker: "B", text: "They steal the nest. I don’t know if we can call it kidnapping, but they capture the chicks of raptors.", timestamp: "00:17:00" },
      { speaker: "A", text: "Let's talk about raptors like the griffon vulture. Are most of the griffon vultures local to Palestine tagged by the Israeli military?", timestamp: "00:17:17" },
      { speaker: "B", text: "Israeli military? Authority? I consider them the same.", timestamp: "00:17:27" },
      { speaker: "A", text: "They stated in recent years that griffon vultures are no longer breeding in Israel or Palestine – a claim that has been made in various reports over the last decade or so. So they tag most of the vultures situated here. Do you know why they are tagging them?", timestamp: "00:17:35" },
      { speaker: "B", text: "The griffon vulture has a special story. They are scavengers – they eat dead animals. Unfortunately, their population in our region is declining like crazy. One major reason is secondary poisoning. Farmers, especially around breeding sites, poison dead cows, sheep or goats to kill predators like the grey wolf. The vultures don't understand that these dead animals are poisoned – they eat them. They either die immediately or have problems during the breeding season – for example, the eggshell becomes fragile, so when the male or female sits on the eggs, they might break them, and the breeding season fails. This has happened many times – tens of vultures found dead.", timestamp: "00:17:59" },
      { speaker: "B", text: "Another part is that vultures have lost their habitat – either in the West Bank or in Israel. And they have lost food. They cannot find enough food in the wild because of declining numbers of wild animals. It’s complicated. In the West Bank, we don’t have a single vulture breeding pair. If you go back two centuries, Henry Tristram – one of the early explorers – indicated that Wadi al-Qelt (وادي القلط), which extends from the hills east of Jerusalem down to Jericho and the Jordan River, used to have hundreds of vultures on the rocks. So the decline is extreme – almost reaching extinction.", timestamp: "00:19:59" },
      { speaker: "B", text: "However, in Israel they are doing rehabilitation and artificial breeding, and they tag as many as they can. I’m not sure how many individuals remain – 150, 200? And these vultures don’t stay all year round in our region. They might go to Saudi Arabia, Yemen, or nearby European countries. They have a huge dispersal distance, and they face other threats – hunting by people from Arab and non-Arab countries.", timestamp: "00:21:35" },
      { speaker: "A", text: "Can you tell me the difference between a local person doing birdwatching versus a person with a profession in understanding the science of birds – the ornithological process?", timestamp: "00:22:25" },
      { speaker: "B", text: "Birdwatching is a hobby. People go to the wild, try to see birds, enjoy their movement, colours, voices, and record birds for their own personal enjoyment. Birdwatching is a luxurious hobby – you need binoculars, a camera, telephoto lens, and other equipment to detect birds, take photos, or record calls. Not many Palestinians have the money for this equipment. On the other side, birdwatching for research purposes is completely different. You need a methodology to follow in order to record birds for scientific research – for example, studying population density, population dynamics, or breeding of a specific species. You use birdwatching as a research methodology to get data that can be analysed and answer your research questions.", timestamp: "00:22:35" },
      { speaker: "B", text: "In the West Bank, we have several birdwatchers and wildlife photographers who are not doing research – they record species for themselves or to have their photos exhibited. But they are not aware of many scientific questions about birds in Palestine. Unfortunately, for both hobbyists and researchers, it’s not easy to conduct birdwatching in Palestine, mainly because of the political situation. If you have the equipment, the car, the money for petrol, you still need to go to places where you can do surveys. Most nature reserves are in Area C – under Israeli control. Access is difficult. And after October 2023, we have almost no access – not only because of the Israeli army, but also because Israeli settlers have become very violent against Palestinians. Many good birding sites are close to Israeli settlements, which we are not allowed to approach. They can be considered military areas. In the last two years since October 7th, I have not managed to conduct any bird survey or plant survey. Two or three times I was confronted by Israeli settlers – they were very violent, and I could not continue my work. I decided to wait until the situation calms down before starting field surveys again.", timestamp: "00:24:00" },
      { speaker: "B", text: "Birds have become a source of income for some Palestinians. They hunt birds or other animals and sell them. This is because of limitations on finding good income. Since October 7th, many Palestinians who used to work in Israel have been banned from entering Israel – they couldn’t find jobs. Some returned to work their land as farmers, but others didn’t have land. Another source of income or way to use their time is hunting birds, capturing birds of prey, or poaching nests of raptors. It became a source of income, even though it’s not much money – four or five hundred shekels, a thousand shekels – but they had no other source. Since October 2023, hunting within Area A and B has increased significantly. Before that date, there were Palestinian hunters, but hunting was not as intense as these days.", timestamp: "00:26:00" },
      { speaker: "B", text: "Another thing that is really problematic is that Palestinians have managed to import mist nets from China – nets to catch birds. Now they catch birds in significant numbers. They sell these nets, and you can see people selling them on Facebook. Many people buy these mist nets, learn how to work with them, and capture more and more birds. They sell live birds, especially songbirds like the goldfinch, or other rare birds with nice sounds that can be used in the bird trade. So many things have worked together to make hunting more intense in the last two years.", timestamp: "00:27:22" },
      { speaker: "A", text: "You mentioned that hunting is part of Arab culture.", timestamp: "00:28:32" },
      { speaker: "B", text: "Yes. If you look at Arab culture – the Gulf States, Saudi Arabia, Qatar, Bahrain – they hunt birds and use raptors like falcons in their hunting hobbies. Hunting was part of Arab culture in general. It’s like other countries, not only Arabs. But when you have a job and a good income, hunting can be converted to other things – like birdwatching, or other hunting sports, but not hunting birds. We don’t have that ability here in the West Bank.", timestamp: "00:28:36" },
      { speaker: "A", text: "I came across an article where a Palestinian person was putting birds inside their socks in a little net – maybe 20 birds around their leg. These people buy or capture birds in Jordan and try to smuggle them into the West Bank through the Allenby Bridge. The Israelis or Palestinians sometimes find these things, arrest the people, and release the birds. Some Palestinians succeed in smuggling the birds here and then sell them to other Palestinians. It’s a business. They sell them as pets.", timestamp: "00:29:21" },
      { speaker: "B", text: "Yes, because they have specific birds – mainly the goldfinch, which is the most expensive bird because it has a very nice sound and many people like to have them as pets. But by Palestinian law and Israeli law, these birds are not allowed to be hunted, captured, or kept as pets because they are endangered.", timestamp: "00:30:12" },
      { speaker: "A", text: "I saw your bird outside.", timestamp: "00:30:54" },
      { speaker: "B", text: "Yes, it is a goldfinch, actually. We got it from the Environmental Quality Authority. It was confiscated from a hunter and was in bad condition. We rehabilitated it, took care of it, and now it is a healthy bird. We are not sure if we can release it back to nature because it was raised in captivity – it’s not easy to rehabilitate it for release. But we are doing our best. If we think it is capable of surviving by itself, we will release it. This is part of what we do at Nature Palestine Society – we rehabilitate confiscated wildlife birds brought to us by the tourist police or the Environmental Quality Authority. We treat them, rehabilitate them, and do our best to release them back to nature.", timestamp: "00:31:00" },
      { speaker: "A", text: "Speaking about birds that are disappearing – you spoke earlier about how most of the birds prefer to live around Israeli settlements. Why is that?", timestamp: "00:32:08" },
      { speaker: "B", text: "Not most birds, but the birds or animals that are under hunting pressure from Palestinians have found that around these illegal Israeli settlements, the environment is safer for them – simply because Palestinians are not allowed to come close to these settlements. Through time, they have understood that these places are safer than areas around Palestinian towns or cities. Unfortunately, this is part of the reality now in the West Bank.", timestamp: "00:32:20" },
      { speaker: "A", text: "Do you think birds have a sense of awareness of their localities with architecture? Generally they move around different flora and fauna, and wetlands. In the West Bank, how does that affect them?", timestamp: "00:33:01" },
      { speaker: "B", text: "By experience, they realise that these areas are safer than others. That’s one side. The other side is that most Area A and B are populated by Palestinians, so there isn’t much open landscape for birds to survive, expand, or forage. Most Israeli settlements are surrounded by natural habitat, a bit far from Palestinian urban areas. So for birds, there is better habitat there, and it is safer. By time and experience, they understand this. They say that animals think – even though we cannot say that, by experience they understand which areas have better and safer habitat. Unfortunately.", timestamp: "00:33:16" },
      { speaker: "A", text: "Coming to Ramallah, I’ve actually seen more birds here than in Bethlehem. I came across the common myna – the one that imitates sounds and also eats the eggs of sparrows. Is the myna an invasive species?", timestamp: "00:34:10" },
      { speaker: "B", text: "Yes, it is the worst invasive bird species in the Middle East. It really affects the population of other bird species and other animals. It is aggressive. They mimic some sounds of other animals and birds, but they don’t mimic people talking – sometimes people say they can teach them to talk, but they are not able to do that. They mimic the sound of other birds. I have noticed they can mimic the sound of a falcon – to scare other species and keep their territories safe. These birds are a big problem in Palestine. They affect agriculture crops and wildlife, especially birds and other small animals.", timestamp: "00:34:23" },
      { speaker: "B", text: "You can see them more in Ramallah than in Bethlehem. I think they are all over urban areas. They live within urban areas – you cannot find them easily in open landscapes; that is not their habitat. They prefer urban areas.", timestamp: "00:35:14" },
      { speaker: "A", text: "Do you know how they got here?", timestamp: "00:35:37" },
      { speaker: "B", text: "There are several theories. Mainly, these birds were brought to the Middle East – to Israel – about 30 or 40 years ago as pets and kept in zoos. At some point, people realised they are aggressive and released them back to nature, but they are not part of our nature. In some cases, birds escaped from zoos in Tel Aviv. From there, they started to breed and adapt to our area. Since then, they have become found everywhere. The first myna bird I recorded was in 2005 or 2006 – the numbers were very small in the West Bank, closer to the separation wall. But today you can find them anywhere within Area A and B in urban areas.", timestamp: "00:35:40" },
      { speaker: "A", text: "You have a very acute sense and sensitivity to listening to birds. Would you say this has become very organic for you? Have you noticed through listening how the landscape has changed for bird movement?", timestamp: "00:36:40" },
      { speaker: "B", text: "I can answer this in a different way. Since we talked about the common myna – instead of waking up to the sound of the house sparrow or other local breeding birds, we now wake up to the sound of the common myna. Here we can sense the difference. Not only me as a birdwatcher or researcher, but local communities – regular people – can understand that there are changes. We used to hear the house sparrow in the morning or the blackbird. Now we hear the call or noise of the common myna.", timestamp: "00:36:54" },
      { speaker: "A", text: "How does that make you feel when you hear the common myna?", timestamp: "00:37:36" },
      { speaker: "B", text: "That the environment in Palestine is changing dramatically – for the worse.", timestamp: "00:37:43" },
      { speaker: "A", text: "To steer this into understanding what is not spoken about, what is not named – in your work as a scientist, conservationist, and researcher under Israeli occupation, do you consciously choose how to build an intersection with the research you are doing?", timestamp: "00:37:52" },
      { speaker: "B", text: "What do birds teach you that cannot be learned through data reports? Several things. One is how fragile the ecosystem or habitat is where these birds live and complete their life cycle. This is important to learn – to know how to conserve and protect these ecosystems. When we conserve habitats for birds, we are also conserving them for other animals, insects, bees – which is part of the whole cycle of conserving the ecosystem. As humans, we don’t understand how fragile an ecosystem can be. We know the desert ecosystem is fragile, but it seems all ecosystems are fragile. We should spend more time and effort conserving them – for birds, animals, all living species, including humans.", timestamp: "00:38:11" },
      { speaker: "B", text: "Birds also teach us how to be patient, how to survive, how to live in harmony with nature – where data cannot tell us anything. Observing birds, each species is unique – in how they live, survive, forage, deal with different environmental conditions, and cope with climate change. Being patient and trying to understand how birds survive environmental changes – whether caused by humans or natural disasters – is something we need to learn from birds and other animals.", timestamp: "00:39:28" },
      { speaker: "A", text: "Do you think birds are predictable?", timestamp: "00:40:24" },
      { speaker: "B", text: "That’s a tough question. In some cases, yes – when it is part of their natural cycle, you can more or less predict their movement and behaviour within normal conditions. But when we talk about climate change, disasters, or extreme weather conditions, it is very difficult to predict their behaviour or how they will survive.", timestamp: "00:40:28" },
      { speaker: "A", text: "In the context of interruption and change, have you noticed moments where birds behave as if something in the landscape has fundamentally changed – for example, disturbance from infrastructure, power lines causing electrocution?", timestamp: "00:40:59" },
      { speaker: "B", text: "We have several breeding birds whose populations have declined in our region due to habitat destruction, urbanisation, and hunting. Let’s talk about the goldfinch – it has almost disappeared from the West Bank. It can still be found in very specific places where they feel protected and there is not much disturbance. Other birds are soaring birds – migratory species that cross from Europe through the Middle East, through Palestine, to Africa during their winter migration, or on the way back from Africa to Europe and West Asia during spring. They are social species – for example, the white stork. They migrate together in large flocks. Most individuals roost during the night. Some remain for a couple of days or weeks foraging in specific sites to refuel and regenerate energy. Some are electrocuted by major electrical wires.", timestamp: "00:41:12" },
      { speaker: "B", text: "We had a bird from Poland that we found dead in the northern West Bank – it was tagged in Poland. We collected the ring. This is a ring from Poland: PLG (Poland–Gdańsk), with a unique number, 86P50. It belongs to a white stork that was ringed in Poland. This bird also had satellite telemetry. We contacted the organisation that did the ringing, but unfortunately we could not send them back the transmitter or the ring.", timestamp: "00:42:28" },
      { speaker: "B", text: "Many birds are killed by electrical wires. The main reason is that these wires are not protected – not insulated with special materials. Some birds die from electrocution. In the West Bank, we cannot protect the birds from electrocution or insulate the wires – it is expensive. Palestinians have other, more important things to do. This is how the government thinks – which is in a way justifiable.", timestamp: "00:43:15" },
      { speaker: "A", text: "The conditions of why these wires aren’t protected – for some Egyptian vultures, they get electrocuted and also poisoned. The poison comes from agriculture – pesticides and such.", timestamp: "00:44:07" },
      { speaker: "B", text: "Not only pesticides. Some vultures or scavenger birds die from secondary poisoning, where farmers poison cows, goats, or sheep to kill predatory mammals like the grey wolf. Accidentally, these scavenger birds eat the poisoned carcasses. They die, or they cannot have a successful breeding season. That is another reason for the decline in these large scavenger birds.", timestamp: "00:44:19" },
      { speaker: "A", text: "With the power lines in the West Bank, when birds get electrocuted, is it the same in the context of settler architectural infrastructure? Are there power lines in the same situation, or do they have more money spent on protection?", timestamp: "00:44:51" },
      { speaker: "B", text: "They do have more money. Since these settlements are recently built, their power lines are more or less protected than those in the West Bank, which were established many years ago. So they are a bit more protected around the settlements. But the same problems can be found in Israel – it’s not only a Palestinian problem, it’s a global problem. Some countries have the money to insulate power lines; others do not.", timestamp: "00:45:05" },
      { speaker: "A", text: "Does collision through altitude come into play, or is it random? When a bird gets electrocuted on power lines, is it through flying?", timestamp: "00:45:37" },
      { speaker: "B", text: "It’s not through flying. What these birds do is perch on the power lines. When they open their wings, they touch two different power lines at the same time, and then they are electrocuted. So it’s not through flying – it happens when they are roosting and trying to find a place to perch.", timestamp: "00:45:45" },
      { speaker: "A", text: "My next question is about listening. Is there a sound – or a disappearance of sound – that signals to you that a place is no longer functioning as it should?", timestamp: "00:46:16" },
      { speaker: "B", text: "I think I answered this question previously, but in a different way. We have a major problem with the invasive common myna. Before – let’s say 15 years ago – we used to wake up to the call of the house sparrow or the songs of the blackbird, which are common within the Mediterranean area. But recently we wake up to the sounds of this aggressive, invasive bird. This tells me we are facing a major problem. It has become the most common bird species in West Bank urban areas – which is not supposed to be the case. We are supposed to have our local birds, our native species – like the blackbird, the graceful prinia, and other species we see around us. This sends us an alarming message that there is a big change within the urban area. If you look at the avifauna of the urban area in the West Bank, unfortunately we cannot do much about this bird. Sometimes we reach a point of no return – I hope we are not at that stage.", timestamp: "00:46:28" },
      { speaker: "B", text: "Let’s talk about the goldfinch. It has one of the most beautiful songs. Before 20 to 30 years, it was a common species. When you went to the field, you heard them singing – you felt the place was still like a virgin area, with goldfinches singing alongside other birds. But in the last 15 to 20 years, we have stopped hearing these songs from this species and other common species we used to have in the West Bank. The decrease is related to human activity – anthropogenic effects – capturing or hunting these birds for different purposes: as a hobby, as a food source. In some places where they used to be in good numbers, now we don’t see them. This sends us a big alarm message: we need to increase public awareness about these birds, their habitats, and their ecosystems, and work together with local communities to conserve them.", timestamp: "00:48:05" },
      { speaker: "A", text: "In your opinion, which bird would you say is the one disappearing in a vast way? Would you say the goldfinch?", timestamp: "00:49:13" },
      { speaker: "B", text: "The goldfinch is definitely one of these species. It was hunted in large numbers during the 60s, 70s, 80s, and even the 90s. Now we don’t see them around us at all – only in specific places, maybe three or four locations within the West Bank.", timestamp: "00:49:21" },
      { speaker: "A", text: "Have you encountered places where birds are protected more than people?", timestamp: "00:49:45" },
      { speaker: "B", text: "Yes. If you talk about places near Israeli settlements, birds and wildlife are more protected than Palestinians around these areas. For example, if a Palestinian approaches any of these settlements and is suspected of anything, he would be arrested, shot, or killed – but birds are flourishing there, unfortunately.", timestamp: "00:49:51" },
      { speaker: "A", text: "If you were to send a message to people who are aware of their surroundings and their everyday environment – an understanding of what to sense and what is important to coexist with habitat and environments – what message would you want to give?", timestamp: "00:50:28" },
      { speaker: "B", text: "We as Palestinians need to work together to conserve the land, the habitat, the species, the wildlife – animals, plants, everything. Conserving bird habitats and plants is exactly the same as protecting ourselves. It is the same as seeking our independence. It is the same as fighting the occupation. We cannot seek freedom and not care about the birds, the animals, the ecosystems, or the habitat. We should all work together. We need to increase public awareness in local communities. We need better laws and enforcement of the law to protect the Palestinian environment, wildlife, habitat, and ecosystems.", timestamp: "00:50:45" },
      { speaker: "A", text: "Would you consider this awareness a form of resistance?", timestamp: "00:51:38" },
      { speaker: "B", text: "Definitely. 100%. This is how it should be. We have to fight for our freedom, for our survival, for our environment, for the wildlife – because we are part of the wildlife, the ecosystems, and the habitat. We cannot survive without them.", timestamp: "00:51:42" },
    ],
  },

  // -------- INTERVIEW 3 (replace with your own transcript) --------
  {
    id: 3,
    title: "Interviewee: Simon Awad",
    meta: "Executive Director, Environmental Education Center, Talitha Kumi",
    date: "Recorded in Beit Jala, 2025",
    transcript: [
      { speaker: "A", text: "Can you please introduce yourself and what you do?", timestamp: "00:00:00" },
      { speaker: "B", text: "My name is Simon Awad. I am executive director of the Environmental Education Center, which is a ministry of the Evangelical Lutheran Church in Jordan and the Holy Land. Also, I am a counsellor in IUCN – the International Union for Conservation of Nature. I was recently elected last October, and I also serve as a board member of OSME (Ornithological Society of the Middle East) – the Ornithological Society of the Middle East and the Caucasus. I am also involved as a co-chair of the ACT Alliance for Climate Change. Previously I have been a member of the working group for climate change and water in the World Council of Churches.", timestamp: "00:00:05" },
      { speaker: "A", text: "And when was the Talitha Kumi station opened?", timestamp: "00:01:13" },
      { speaker: "B", text: "Here, the Environmental Education Center started about 40 years ago. This year, we will celebrate 40 years of our work and service. It started in 1986 as a program called 'Involvement and Awareness.' It was a program for Lutheran schools, and then it developed into 'Children for Protection of Nature in Palestine' in 1992. In 1998 we came here, inside this campus, and started working with the natural museum and environmental exhibition. During the years we developed a botanical garden, we opened a ringing station here as a permanent one, and we have another seven seasonal ringing stations around the West Bank.", timestamp: "00:01:18" },
      { speaker: "B", text: "So we renamed our centre to be Environmental Education Centre in 2001, when I became the director of it. I had been a researcher and educator before that. I was also the director of a project called 'Birds Know No Boundaries.' And in 2001, we decided to change the name of the centre to Environmental Education Centre because our target group was not just children – it now started to include women, teachers, and other members of society.", timestamp: "00:02:20" },
      { speaker: "A", text: "Okay, I understand the Talitha Kumi Ringing Station is the first in Palestine.", timestamp: "00:03:10" },
      { speaker: "B", text: "First ever in Palestine and in the Arab world, within Arab and Palestinian researchers. There are many ringing stations run by the British and others in different Arab countries, but this was the first where locals were trained and qualified to run it. You know, you need to be qualified – there are long procedures – to be a ringer, and not just to decide. Being a manager of ringing stations is also another process. So we succeeded in all of this and we took the international license to do our work in 2000.", timestamp: "00:03:17" },
      { speaker: "A", text: "You said you went to the UK to do your training.", timestamp: "00:04:08" },
      { speaker: "B", text: "I went to the UK and to Poland for a long period. I also went to the United States and served in different ringing and banding stations around. When you are in the procedure to be qualified, you need to visit many places and many countries and to have many species in your list that you have ringed and identified before you start this work. It is hard work. I did it in a very short time compared to others because I gave all my time to it. It takes around 18 months to get the license. Other people took more years to achieve it.", timestamp: "00:04:13" },
      { speaker: "A", text: "Going back to Cornell University – they are very much the pioneers of waterbirds and bioacoustics – you were there quite early.", timestamp: "00:05:18" },
      { speaker: "B", text: "Yes. We were in 2000 with them in California, Sierra Nevada, for a course about acoustic systems in the field: how to record the voices of nature, birds, and others; how to work on that, classify the voices, and analyse them in the laboratory. There is a program on a computer where you input the voices, remove surrounding noise, and then you make a spectrogram. We discovered that each bird has its own sound signature. So all birds have different signatures, and that is how we started working with that. When we came back, I started working beside the ringing station and opened the ringing station in March 2000.", timestamp: "00:05:28" },
      { speaker: "B", text: "We started to work on what you call recording the voices and sounds of birds during migration, using satellite recorders overnight. We have a lot of data, but we didn't know how to deal with it. If there are people who want to work on that, we would like to share it and work together to achieve the results. And this is how things went on with Cornell University.", timestamp: "00:06:58" },
      { speaker: "A", text: "I would love to see it, because I work with spectrograms – I look at voices, human voices, as well as fake voices, but also echolocations – understanding patterns in spectrograms as well. So it's curious to understand, because I'm guessing you were recording spectrograms, you were translating spectrograms to understand how to develop the bioacoustic technology that's called now – for example, you have eBird based in Ithaca.", timestamp: "00:07:38" },
      { speaker: "B", text: "Yes, eBird. We record some of our monitoring in eBird, yeah.", timestamp: "00:08:18" },
      { speaker: "A", text: "Now for something more about practice and methods. Can you walk me through how a typical morning of bird ringing works here?", timestamp: "00:08:30" },
      { speaker: "B", text: "Yeah, it's very exciting. You wake up very early to go to the field and you have hope to catch a new species all the time. And this makes you energetic. 'Today I will be lucky to find a new species.' So this is how things go on. You watch birds around, go to the nets, collect birds, then you ring them, and after the measurements, you set them free again into nature with the ring around their legs to follow their migration routes.", timestamp: "00:08:40" },
      { speaker: "A", text: "How do you integrate ringing data with other monitoring tools like radar or acoustic detection?", timestamp: "00:09:30" },
      { speaker: "B", text: "You know, radar – we couldn't bring radar here because of the political situation. In 1998, part of our project was to have our own radar for civil work, not military. But Israel said that you can't have this radar here. Because we are at high altitude here – more than 900 metres above sea level – it's a very good place to put the radar. And they said one of the excuses was that maybe we would see the airplanes of Ben‑Gurion and the aircraft, and the radar would cover 20 to 30 kilometres around, so it's not far away from the airport. And then the second intifada started, so we didn't follow up because things were very hard to demand this issue again.", timestamp: "00:09:42" },
      { speaker: "A", text: "I understand. Is it Yossi Leshem who also conducts all the radar?", timestamp: "00:11:00" },
      { speaker: "B", text: "Yes, here in Har Gilo, in Beit Jala. He has two radars – one old one on the mount opposite to us, yes. The Americans tried to intervene to bring it to us, but they refused. And then Yossi Leshem installed a radar in the Latrun area to monitor birds, and he brought two experts from the former Soviet Union to work inside to collect the data. Because he has a monopoly on the radar systems – he has full access. Yes, you know, this is also politics. They give one side and the other side permission to conduct research for many reasons.", timestamp: "00:11:06" },
      { speaker: "A", text: "So the radar system is nearby here?", timestamp: "00:12:06" },
      { speaker: "B", text: "It was an old one – I don't know about it; this was like 20, 25, 30 years ago. We've heard that the Americans brought two people to work on that, and they gave us part of the data on birds – to see at what altitude they were flying. We took the results from many researchers who were studying at Haifa University and elsewhere. So they, as Israelis, have access to work inside this place. I haven't been involved in this, but I am speaking about the history. And after that, we couldn't get data and we couldn't have anything else. Because everything had collapsed and we haven't had any cooperation since 2000.", timestamp: "00:12:12" },
      { speaker: "A", text: "How does that affect your work? Does this mean you have to collaborate with the Israelis to get the data you need?", timestamp: "00:13:24" },
      { speaker: "B", text: "It didn't affect our work. It affected scientific research continuing in this way, but it didn't affect our work in ringing, education, or any of those areas.", timestamp: "00:13:36" },
      { speaker: "A", text: "How do you ensure the safety and welfare of birds during ringing and handling?", timestamp: "00:13:56" },
      { speaker: "B", text: "First of all, we use very scientific and very safe nets that we bought from abroad for this purpose, and we have highly qualified staff who know how to take birds out of the nets without harming them. Mostly we have zero handling accidents, but we do have incidents where raptors or other birds attack the birds in the nets. That is not in our hands – it is part of nature.", timestamp: "00:14:05" },
      { speaker: "A", text: "I can stop for a moment to see this guy.", timestamp: "00:14:40" },
      { speaker: "A", text: "So the next question is about collaboration and knowledge sharing. Do you collaborate with other local or international stations for data exchange?", timestamp: "00:14:50" },
      { speaker: "B", text: "Yes, we are part of a wide network. We are seen as part of the Southeast European network, based at Gdańsk University in Poland. And we have been working closely with EURING (European Union for Bird Ringing) for a while. Whenever we ring a bird, we inform them, and they inform other people. We also get messages from them when they catch our birds, providing us with information. We have caught many birds from different areas like Sweden, Lithuania, Latvia, Turkey, Cyprus, and other places, and our birds have been caught in Bulgaria, Poland, and other areas. So this is how we exchange experience and information.", timestamp: "00:15:02" },
      { speaker: "B", text: "But as I mentioned, this would be excellent if technology had been used. Mostly it is manual work. It's not technology. Mostly we rely on ringing – catching birds by hand and putting on the rings. But if we could use technology, as we spoke about before we started recording this interview, this would be awesome and this would be a great advancement in ringing methodology.", timestamp: "00:16:28" },
      { speaker: "A", text: "And when you say technology, are you mainly talking about GPS trackers?", timestamp: "00:17:02" },
      { speaker: "B", text: "Yes, but that would cost a lot of money. The problem is that you need a satellite. Once, we had cooperation with Lufthansa. We tagged – or put transmitters on – eagles, white storks, and others. They helped us using a NASA satellite to bring back information. But after that, it's not easy, and it costs a lot of money if you want to study in this way.", timestamp: "00:17:10" },
      { speaker: "A", text: "But because of the occupation, are you allowed access to trackers?", timestamp: "00:18:00" },
      { speaker: "B", text: "I don't know if that would affect anything. We didn't have this to start with. But I think it's like we let them fly away and then monitor them via satellite.", timestamp: "00:18:08" },
      { speaker: "A", text: "How do you use or share the data collected here for broader research or conservation efforts?", timestamp: "00:18:50" },
      { speaker: "B", text: "We have published our checklist, and this is very important to share with others. With our checklist, we also include the conservation status of each bird according to the IUCN category. We wrote a column about that, so we have some endangered species and others. We are working on this. We have two conferences about biodiversity. We started some connections with colleagues from different countries in the region, because Palestine and Jordan share the same birds and the same routes. We started thinking about cooperation at the regional level. We made a study about, for example, Syria, Lebanon, Palestine, Iraq, and Jordan. And we published an article in OSME (Ornithological Society of the Middle East) about that. It is a very endangered species, with low numbers. So we try to use this information.", timestamp: "00:19:00" },
      { speaker: "B", text: "But in the near future, given my position now as a counsellor, I think I should do more work at the regional level and the global level to achieve more nature conservation. Most people here don't understand conservation issues. For example, there is a museum that you visited, about seven years old, which has more than five to seven thousand specimens. This means no conservation issue – it means that mostly they killed all of these animals to stuff them. For many years, we have never killed any animals to stuff them. But when we find dead animals, we keep them and then stuff them. This is not a good way of conservation. People don't understand. They think this is scientific research, that we need to collect specimens and stuff them. But today you don't need to do this. You can use cameras – you can put a camera in the nest, you can attach a camera to the bird while it is travelling. So you don't need to kill animals to teach people. You have technology available to use instead. This is what we want to promote, but some people still have a very limited idea about conservation and don't understand the meaning of nature conservation. I'm sorry to say that.", timestamp: "00:20:36" },
      { speaker: "A", text: "Do you think it is still a practice to kill animals and stuff them?", timestamp: "00:22:20" },
      { speaker: "B", text: "I don't know how you could gather all these animals in such a short time.", timestamp: "00:22:26" },
      { speaker: "A", text: "So what are the most common species you capture here, and what have you learned about their migration patterns?", timestamp: "00:22:34" },
      { speaker: "B", text: "I think it is the Blackcap and the Lesser Whitethroat – the top two warblers that we have in high numbers all season. They are the top ones. Here we have stable numbers, but this is not usual. Sometimes it is a climate change issue. Climate change causes populations of some species to move, then they settle, and then the numbers come back again. But with climate change, we need to work hard to collect more data, analyse it, understand it, and see how things go on. And because of the disappearing fauna and flora, as well as climate change – climate change is also about what is disappearing from the land that birds no longer visit.", timestamp: "00:22:44" },
      { speaker: "B", text: "We have a lot of habitat change. This is the main reason. You have a lot of urban and illegal Israeli settlements, also all these barriers for security – all these walls and fences around. So this makes life hard for the wildlife of Palestine. This needs to be stopped. Animals need to move freely in the country, and so do people – for human rights. But here we are focusing on nature and environment. I think this is a very important issue to work on.", timestamp: "00:24:10" },
      { speaker: "A", text: "We talked a little bit earlier about Jisr al-Zarqa (جِسْر الزَّرْقَاء), where the fish farming site is. I was also told it was a bird monitoring site. Is that true?", timestamp: "00:25:18" },
      { speaker: "B", text: "It's a little far away. It's near the shore, in some places. There are places you can go – Israel Nature Reserve sites – to see where they have these issues. It's more to do with understanding how the legal occupation of the Israelis, how they're taking over land and what they're doing with it. Because the site is a protected area for conservation, but they're also taking more land, not working with Palestinians. Yeah, this is the point: that's why Palestinians don't like the idea of a green area or protected area. Because mostly, when they confiscate the land for a green, protected area, then it will become like a settlement. It started as a green area – Har Gilo. And it was designated for Israeli nature conservation. And then it became a settlement. So this is how the procedures go on. This is why people are scared and worry when they hear about these issues.", timestamp: "00:25:30" },
      { speaker: "A", text: "Have you seen long-term trends in numbers or behaviours at the station?", timestamp: "00:27:00" },
      { speaker: "B", text: "We need more time. We have reached maybe 23,000 birds, but you need to catch more birds regularly in different areas and work on it. You need the staff and you need salaries. We do it as voluntary work. Even though we are employees, this is additional work for us – voluntary, not part of our regular duties here. So these issues are very important to continue with. It needs money and capacity. I have thought many times about bringing colleagues from other places to help us, but it's not safe – not safe for about five years now, with Covid and then the war. We have lost five years of our lives.", timestamp: "00:27:10" },
      { speaker: "A", text: "Have you seen any specific bird species that have just disappeared?", timestamp: "00:28:20" },
      { speaker: "B", text: "No. But we have a study over 10 years – 10 years of bird ringing and monitoring here at this site, the Talitha Kumi ringing and banding station. We found that many species have decreased in number, but according to... There is, for example, the Brown Fish Owl. It has already become extinct from here and from the Middle East. We have one stuffed specimen here in the museum from 1910. You will have all of this in the checklist when you summarise them.", timestamp: "00:28:28" },
      { speaker: "A", text: "I actually had a visit to the museum and saw it – I was trying to remember which owl it was when I saw it. This is the biggest one.", timestamp: "00:29:18" },
      { speaker: "B", text: "Yes, the big tall one.", timestamp: "00:29:28" },
      { speaker: "A", text: "How does this station fit into bird migration monitoring across the region? How does it fit into? Because you have one station here in Bethlehem. We have Jenin, Jericho, Tulkarm, Beit Sahour, and Beit Jala. It's slowly... We are doing monitoring of the West Bank. One here, one here, one here, one here. So it's some kind of coverage. And we have colleagues working in Al-Azraq in Jordan, in Al-Zarqa, in many places, in Egypt. And we have already been publishing some studies about all of these ringing stations – how things go on.", timestamp: "00:29:32" },
      { speaker: "A", text: "I guess this is a deeper question. Why was this station created, and what were the complexities that came from this?", timestamp: "00:30:42" },
      { speaker: "B", text: "We started as a tool for education and for scientific research to collect data, but mainly as an educational tool in the beginning, because nobody understood that we would continue for 25 years. People never continue this way for all these years. For us, it was like a project for two years, and it would be finished, but for me it was a very important issue to continue with. Even though we don't have money for this ringing station, all the time I am cutting from different budgets to make it sustainable and to continue.", timestamp: "00:30:54" },
      { speaker: "A", text: "This is also co-run with a German institution and the Swedish church?", timestamp: "00:31:56" },
      { speaker: "B", text: "We don't get any money from the Germans. We receive funding from the Church of Sweden. They give it to us for care of creation, for justice issues. Most of our work focuses on this issue.", timestamp: "00:32:03" },
      { speaker: "A", text: "And what is the connection with the Germans? Are they a charity or a school?", timestamp: "00:32:18" },
      { speaker: "B", text: "Here it is a school, but in German it is a mission. It is called the Berlin Mission, which runs the school. The Berlin Mission does many good things around the world. For this, they donate money, but not to us – maybe to the school itself. We and the school have different administrations and different financial channels. When the school was developed, they bought this land. I don't know the history of the land, but it is said that the Palestinian people of Beit Jala donated part, and some of the land was bought by nuns. Then, after the Nakba in 1948, when the Talitha Kumi school was on Jaffa Street, the Israelis demolished the school in the war and kicked them out. So they became refugees and came here. The church gave them a place to stay. In the 1950s, the Palestinian Lutheran Christian Church started to run the school, but it required a large budget and they couldn't afford it. So the Berlin Mission said, 'Okay, we will provide the money to run the school.' So they cooperated at that time. But now we have a case in court about who owns the land and who has access. And this is why the mayor said he suffered from that a lot.", timestamp: "00:32:26" },
      { speaker: "B", text: "We have been in miserable conditions in our offices here – sewage water coming in. All the time we had to buy plastic and nylon to cover our heads and our computers. It was a very hard time. But now, we succeeded in making a renovation, and yeah. He said earlier, 'Oh, your floor.' This is a new one, because he left before they finished. He left in June. He's the one who said no, no, no, no for seven years. And last year, he totally turned and said, 'Yes, I will not leave you living in this condition, and I would like to help you.' So he made the decision to do it. At the end of the day, at least it's good to see when there's a heart to heart.", timestamp: "00:34:30" },
      { speaker: "A", text: "Because you have so many ringing stations around the West Bank, do you have to also collaborate with the Israeli radar systems?", timestamp: "00:35:30" },
      { speaker: "B", text: "No, no need. It's in Palestinian areas – totally Palestinian.", timestamp: "00:35:40" },
      { speaker: "A", text: "So what are your views on the environmental climate factors? Has the genocide in 2023 affected bird behaviour or the operation of the station?", timestamp: "00:36:00" },
      { speaker: "B", text: "I think mostly what happened in Gaza – nobody knows the result in Gaza. You need people to go and see what's happening in Wadi Gaza, for example, as a protected area, what's happening to wintering species. So you need researchers to go and research the situation. I think for these issues you need researchers all the time. You can't depend on my opinion – it's not my opinion, it's the result. You need to do research and analyse it properly. But also you have a sense – you know, when you spend a lot of time with birds... Yes, we have the sense that here we didn't see any changes, for now, yeah. But in Gaza, nobody knows – you need to work on that. I don't think it's connected. But all the bombs have been in Gaza – all the trash, all the chemicals, all the lead. You know, lead is very dangerous for birds. You don't know the result – how much it has accumulated inside their food and their eggs. You need scientific research. Yeah, and so far nobody has been able – not even local bird enthusiasts. But people in Gaza can't move from one place to another. We have some researchers there, but we didn't ask them these questions. If you want, I will give you the name of somebody in Gaza.", timestamp: "00:36:18" },
      { speaker: "A", text: "Do you have experience in how you adapt your observations or data collection in response to sudden environmental or human‑induced changes? For example, for scientific data you can understand patterns, but when behaviour changes – how do you adapt your observations or data collection in response to sudden changes?", timestamp: "00:38:40" },
      { speaker: "B", text: "We are not at this level. We haven't reached this level regarding behaviour. We just collect data about birds in general. You have obviously been very much educated and understanding – not just in acoustics, when you're talking about Cornell, and also bird ringing. Well, you spend time with birds, so you know their behaviours, even about the human‑bird connection.", timestamp: "00:39:12" },
      { speaker: "A", text: "So I'm quite interested in how you sense the changes in the air – because we can't avoid connecting with... we breathe the same air, we feel what has happened in the environment.", timestamp: "00:39:48" },
      { speaker: "B", text: "I feel that sometimes the birds are very scared and fear the airplane sounds – the sounds coming from aircraft, especially the military ones with high speed and loud voices. You see them sometimes scared and trying to escape, but maybe they get used like us to these sounds. I know the robin is very adaptable.", timestamp: "00:40:08" },
      { speaker: "A", text: "Yes, I mean, for example, they can navigate. We have so much ambient light – excess light – and they say the robin is one of the most adaptable birds.", timestamp: "00:40:36" },
      { speaker: "B", text: "There was a lot of research about robins. One UK study showed that it's not just the photoperiod, but also to the eye. When you look at the eye, you see that the bird can scan the areas when it is travelling and know exactly where to go. There is some detailed research on the electromagnetic sense of the robin – the eyes, the blue light for the north and south magnetic field, as well as the beak. Yeah, they mainly use the rods. We need to read more research to understand.", timestamp: "00:40:50" },
      { speaker: "A", text: "What do you hope for this environmental centre to accomplish in the future? What is your dream?", timestamp: "00:42:00" },
      { speaker: "B", text: "My dream is to have a society that is more aware about the environment and to take action to protect and save it for them and for their grandchildren, children, grandchildren, children, grandchildren, grandsons. And also that the political situation will be more peaceful so that people can move, that they can do their research. If you have peace, maybe you will have cooperation and you will have no borders. You can go wherever you want, because that's just one hour away from here, but for decades we couldn't reach Gaza. Some places, like Jerusalem and others, are far away while it's eight kilometres. All of these borders and challenges should be finished. The world is not going in a good way after what Trump is doing, because he is violating basic human rights, international law, and all of that. For this reason, I think the world is going to more chaos than peace, and this makes me sad. I'm already depressed because I started this year with hopeful things, but then you see things happening around the world that not mean less conflict, but more conflict. Now, according to the news, we have 59 conflict areas, like Taiwan, Cambodia, Palestine, Syria, Lebanon... So it's increasing, not decreasing.", timestamp: "00:42:12" },
      { speaker: "B", text: "I think with this – though you heard this term – it's called a Keynesian way. They call it Keynesian because to bring the economy, you have to keep creating war. A friend of mine from Switzerland summarised it for me and made it very easy to understand. He said, 'Look, it is two big stores: one full of technology and one full of weapons.' You can stop now – we are speaking on a personal level.", timestamp: "00:44:48" },
      { speaker: "A", text: "So in regards to where the ringing station is situated – the environmental centre is situated – it's in between Area A and C. Can you talk a bit about this?", timestamp: "00:45:32" },
      { speaker: "B", text: "I don't know exactly where Area C is and where is A. Decades ago, it was like yellow and brown stones to tell you that this is a Palestinian area, Area A. But these days there is a big red sign telling Israelis not to enter dangerous areas. And sometimes on the road, on an app when you are driving, they tell you this is a dangerous area, don't come in and out, be careful. So on the ground we don't know where Areas A, B, and C are – it's on the map. But in practice, we travel and we don't know exactly where we are located.", timestamp: "00:45:46" },
      { speaker: "A", text: "You don't really know where the environmental centre is located?", timestamp: "00:46:36" },
      { speaker: "B", text: "I'm not sure about A – is my office in A or in Area C? I'm not sure. But this compound, I think it's divided into two areas. I asked many times, even the principal, once he was having a delegation from Germany, and they were asking: if they come from behind, is it Area A or this is Area C – where to bring them in? And I was nearby and heard them say, 'Okay, let me know where Areas A and C are here.' We are confused because we have many maps and we don't know which one is the right one.", timestamp: "00:46:40" },
      { speaker: "A", text: "Also, being part of a German school – does this help with protection at all? Like, in terms of where you are placed – this is the environmental centre.", timestamp: "00:47:28" },
      { speaker: "B", text: "I don't think the Germans are protecting nature in this compound, because when they opened these roads, I asked them if they had done an environmental assessment before they started. They didn't. Then they put all the streets on agricultural land, not in the forest. I asked them to make it more in the forest, because this is introduced trees and we don't like them and we don't need them in Palestinian nature, but they refused and they destroyed all the agricultural land and built on it. Now each year they are suffering from the ground sinking and rising because it was on terra rosa – very good agricultural land. I told them what to do, but they didn't follow my advice. In front of my office was a small forest of six very big carob trees, and I struggled not to let them cut them. When I was away on a Sunday morning – I'm not here – I came on Monday morning and found all the trees had been cut. 'By mistake' – by mistake? Was it a mistake? No – you believe it was a mistake? So this is how things go on. Now they neglect all the agricultural land. I work with them hard to reduce pesticides. They have some material to put on the grass to make it dry – chemicals. I asked them to bring a cutter to do it by hand and then to use it to fertilise the land more. I succeeded in this. Less pesticides and chemicals are coming to this compound.", timestamp: "00:47:42" },
      { speaker: "A", text: "Because you have a lot of indigenous trees here.", timestamp: "00:49:44" },
      { speaker: "B", text: "Yes, we have a lot of indigenous species, especially in our botanical garden. These are the trees here. The others are pine trees – this was introduced by the British. These are pine trees. You can already tell they don't really fit this climate. This is not good for us. The thing is, they planted them, but they don't take care of them. They just wanted something to live. It was planted like 70, 80 years ago. And this is what was available at that time. The only trees that were available? No, but it's – you know, the Europeans like to see the atmosphere and the surrounding area look like their home. Like what the UK British mandate did with Palestine. In historical Palestine, if you go to Haifa, all of these forests, some of them are planted now. And Israel has been realising for maybe five, seven years that they should change their policy toward introduced species and start with native ones. After they lost about forty soldiers in the fire on Mount Carmel, they realised that this is not good for the country and that they need to change the policy. And they started to change.", timestamp: "00:49:48" },
      { speaker: "B", text: "Now I'm working hard with the Minister of Agriculture in Palestine to change this. And we have a nursery in Ramallah where we produce native trees and distribute them freely to the people. But this needs more awareness from the people. Why? Because this pine tree, in five years, will be three or four metres tall, but the oak tree will not. So people like tall trees around their houses.", timestamp: "00:51:18" },
    ],
  },


  // -------- INTERVIEW 4 (replace with your own transcript) --------
  {
    id: 4,
    title: "Interviewee: E",
    meta: "Environmental activist and educator",
    date: "Recorded in Hebron, 2025",
    transcript: [
      { speaker: "A", text: "How do you engage children with nature despite the restrictions?", timestamp: "00:00:00,000 → 00:00:12,000" },
      { speaker: "B", text: "We bring nature to them. We use seeds, photos, sounds – anything we can.", timestamp: "00:00:12,000 → 00:00:28,000" },
      { speaker: "A", text: "What gives you hope?", timestamp: "00:00:28,000 → 00:00:34,000" },
      { speaker: "B", text: "The children. They see the beauty and they want to protect it.", timestamp: "00:00:34,000 → 00:00:48,000" },
    ],
  },

  // -------- INTERVIEW 5 (replace with your own transcript) --------
  {
    id: 5,
    title: "Interviewee: F",
    meta: "Researcher on agroecology and traditional farming",
    date: "Recorded in Nablus, 2026",
    transcript: [
      { speaker: "A", text: "How does traditional farming support biodiversity?", timestamp: "00:00:00,000 → 00:00:10,000" },
      { speaker: "B", text: "Ancient terraces, mixed crops, heirloom seeds – they are a living library.", timestamp: "00:00:10,000 → 00:00:25,000" },
      { speaker: "A", text: "What are the main threats to these systems?", timestamp: "00:00:25,000 → 00:00:33,000" },
      { speaker: "B", text: "Settler violence, land confiscation, and the import of industrial monoculture.", timestamp: "00:00:33,000 → 00:00:48,000" },
    ],
  },
];

export default function InterviewsPage() {
  const [theme, setTheme] = useState("dark");
  const [showTimestamps, setShowTimestamps] = useState(false);
  const [activeInterviewId, setActiveInterviewId] = useState(interviews[0].id);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isLight = document.body.classList.contains("light-bg");
      setTheme(isLight ? "light" : "dark");
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    setTheme(document.body.classList.contains("light-bg") ? "light" : "dark");
    return () => observer.disconnect();
  }, []);

  const activeInterview = interviews.find((i) => i.id === activeInterviewId);
  const currentInterview = activeInterview || interviews[0];

  // ---- Clean timestamps: extract start time if it contains " → " ----
  const cleanTimestamp = (ts) => {
    if (ts.includes(" → ")) {
      return ts.split(" → ")[0]; // take first part
    }
    return ts; // already clean
  };

  const transcriptWithCleanTimestamps = currentInterview.transcript.map((entry) => ({
    ...entry,
    timestamp: cleanTimestamp(entry.timestamp),
  }));

  const mergedTranscript = mergeTranscript(transcriptWithCleanTimestamps);

  return (
    <div>
      <Header />
      <div className="container">
        <h2 className="no-underline">Interviews</h2>
        <p>Conversations with activists, biologists and ornithologists in Palestine.</p>

        {/* ---- Tabs ---- */}
        <div className="tabs">
          {interviews.map((interview) => (
            <button
              key={interview.id}
              className={`tab ${activeInterviewId === interview.id ? "active" : ""}`}
              onClick={() => setActiveInterviewId(interview.id)}
            >
              {interview.title.replace("Interviewee: ", "")}
            </button>
          ))}
        </div>

        {/* ---- Active interview content ---- */}
        <div className="interview-card">
          <div className="interview-header">
            <h3>{currentInterview.title}</h3>
            <p className="interview-meta">{currentInterview.meta}</p>
            <p className="interview-date">{currentInterview.date}</p>
            <button
              className="timestamp-toggle"
              onClick={() => setShowTimestamps(!showTimestamps)}
            >
              {showTimestamps ? "Hide timestamps" : "Show timestamps"}
            </button>
          </div>
          <div className="transcript">
            {mergedTranscript.map((block, idx) => (
              <div key={idx} className={`transcript-line ${block.speaker === "B" ? "b" : "a"}`}>
                <div className="speaker-name">{block.speaker}</div>
                {showTimestamps && (
                  <div className="timestamp">
                    {block.timestampStart} → {block.timestampEnd}
                  </div>
                )}
                <div className="speaker-text">{block.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---- Styles (same as before) ---- */}
      <style jsx>{`
        .tabs {
          display: flex;
          gap: 0.5rem;
          margin-top: 1.5rem;
          flex-wrap: wrap;
          border-bottom: 1px solid rgba(154, 252, 151, 0.3);
          padding-bottom: 0.5rem;
        }
        .tab {
          background: transparent;
          border: none;
          border-radius: 20px 20px 0 0;
          padding: 0.4rem 1.2rem;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          color: rgba(255, 255, 255, 0.6);
          transition: all 0.2s;
          border-bottom: 2px solid transparent;
        }
        .tab:hover {
          color: #fff;
          background: rgba(154, 252, 151, 0.1);
        }
        .tab.active {
          color: #9afc97;
          border-bottom-color: #9afc97;
          background: rgba(154, 252, 151, 0.05);
        }
        body.light-bg .tab {
          color: rgba(0, 0, 0, 0.5);
        }
        body.light-bg .tab:hover {
          color: #000;
          background: rgba(44, 110, 44, 0.1);
        }
        body.light-bg .tab.active {
          color: #2c6e2c;
          border-bottom-color: #2c6e2c;
          background: rgba(44, 110, 44, 0.05);
        }

        .interview-card {
          border: 1px solid #9afc97;
          background: rgba(0, 0, 0, 0.2);
          padding: 1.5rem;
          margin-top: 1rem;
          border-radius: 0 0 8px 8px;
        }
        .interview-header h3 {
          font-size: 1.4rem;
          margin-bottom: 0.25rem;
        }
        .interview-meta {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 0.25rem;
        }
        .interview-date {
          font-size: 0.75rem;
          font-family: monospace;
          margin-bottom: 1rem;
        }
        .timestamp-toggle {
          background: transparent;
          border: 1px solid #9afc97;
          border-radius: 20px;
          padding: 0.2rem 0.8rem;
          font-size: 0.7rem;
          font-family: monospace;
          cursor: pointer;
          color: inherit;
          margin-bottom: 1rem;
        }
        .transcript {
          margin-top: 1rem;
          max-height: 70vh;
          overflow-y: auto;
        }
        .transcript-line {
          margin-bottom: 1.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(154, 252, 151, 0.2);
        }
        .speaker-name {
          font-weight: bold;
          font-size: 0.8rem;
          font-family: monospace;
          margin-bottom: 0.2rem;
        }
        .transcript-line.a .speaker-name {
          color: #9afc97;
        }
        .transcript-line.b .speaker-name {
          color: #ffaa44;
        }
        .timestamp {
          font-size: 0.7rem;
          font-family: monospace;
          opacity: 0.6;
          margin-bottom: 0.2rem;
        }
        .speaker-text {
          font-size: 0.85rem;
          line-height: 1.4;
        }
        body.light-bg .interview-card {
          border-color: #2c6e2c;
          background: rgba(255, 255, 255, 0.8);
        }
        body.light-bg .interview-meta,
        body.light-bg .speaker-text {
          color: #000;
        }
        body.light-bg .timestamp-toggle {
          border-color: #2c6e2c;
          color: #2c6e2c;
        }
        @media (max-width: 768px) {
          .speaker-text {
            font-size: 0.75rem;
          }
          .transcript {
            max-height: 60vh;
          }
          .tabs {
            gap: 0.3rem;
          }
          .tab {
            font-size: 0.75rem;
            padding: 0.3rem 0.8rem;
          }
        }
      `}</style>
    </div>
  );
}