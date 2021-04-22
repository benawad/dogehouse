defmodule KousaTest.Support.Deprecations do
  import ExUnit.Assertions
  import ExUnit.CaptureLog

  # TODO: add versioning stuff in here
  def capture_deprecation(fun) do
    log = capture_log(fun)

    assert log =~ "error"
    assert log =~ "is deprecated"
  end
end
