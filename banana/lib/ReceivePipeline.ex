defmodule Broth.RTP.ReceivePipeline do
  use Membrane.Pipeline

  alias Membrane.RTP
  alias Membrane.RTP.Opus
  alias Membrane.RTP.PayloadFormat

  @impl true
  def handle_init(opts) do
    %{audio_port: audio_port} = opts

    PayloadFormat.register(%PayloadFormat{
      encoding_name: :CUSTOM_OPUS,
      payload_type: 100,
      payloader: Opus.Payloader,
      depayloader: Opus.Depayloader
    })

    PayloadFormat.register_payload_type_mapping(100, :CUSTOM_OPUS, 48_000)

    spec = %ParentSpec{
      children: [
        audio_src: %Membrane.Element.UDP.Source{
          local_port_no: audio_port,
          local_address: {127, 0, 0, 1}
        },
        rtp: %RTP.SessionBin{
          secure?: false,
          srtp_policies: [
            %ExLibSRTP.Policy{
              ssrc: :any_inbound,
              key: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
            }
          ]
        }
      ],
      links: [
        link(:audio_src) |> via_in(:rtp_input) |> to(:rtp)
      ]
    }

    {{:ok, spec: spec}, %{}}
  end

  @impl true
  def handle_notification({:new_rtp_stream, ssrc, 100}, :rtp, _ctx, state) do
    state = Map.put(state, :audio, ssrc)
    actions = handle_stream(state)
    {{:ok, actions}, state}
  end

  @impl true
  def handle_notification({:new_rtp_stream, ssrc, 72}, :rtp, _ctx, state) do
    {:ok, state}
  end

  @impl true
  def handle_notification({:new_rtp_stream, _ssrc, encoding_name}, :rtp, _ctx, _state) do
    raise "Unsupported encoding: #{inspect(encoding_name)}"
  end

  @impl true
  def handle_notification(_, _, _ctx, state) do
    {:ok, state}
  end

  defp handle_stream(%{audio: audio_ssrc}) do
    spec = %ParentSpec{
      children: %{
        audio_decoder: Membrane.Opus.Decoder,
        converter: %Membrane.FFmpeg.SWResample.Converter{
          output_caps: %Membrane.Caps.Audio.Raw{
            format: :s16le,
            sample_rate: 48000,
            channels: 2
          }
        },
        audio_player: Membrane.PortAudio.Sink
      },
      links: [
        link(:rtp)
        |> via_out(Pad.ref(:output, audio_ssrc))
        |> to(:audio_decoder)
        |> to(:converter)
        |> to(:audio_player)
      ],
      stream_sync: :sinks
    }

    [spec: spec]
  end

  defp handle_stream(_state) do
    []
  end
end
